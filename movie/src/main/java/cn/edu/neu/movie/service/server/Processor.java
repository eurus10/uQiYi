package cn.edu.neu.movie.service.server;

import cn.edu.neu.movie.bean.RatingBean;
import com.alibaba.fastjson.JSON;
import org.apache.flink.api.common.functions.MapFunction;
import org.apache.flink.api.common.functions.ReduceFunction;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.api.common.typeinfo.Types;
import org.apache.flink.api.java.tuple.Tuple2;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.datastream.SingleOutputStreamOperator;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.windowing.assigners.TumblingProcessingTimeWindows;
import org.apache.flink.streaming.api.windowing.time.Time;
import org.apache.flink.streaming.connectors.kafka.FlinkKafkaConsumer;

import java.io.Serializable;
import java.util.Properties;

public class Processor implements Serializable {
    public void run() {
        try {
            StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
            Properties prop = new Properties();
            prop.setProperty("bootstrap.servers", "localhost:9092");
            prop.setProperty("group.id", "flink");
            prop.setProperty("auto.offset.reset","latest");
            prop.setProperty("flink.partition-discovery.interval-millis","5000");
            prop.setProperty("enable.auto.commit", "true");
            prop.setProperty("auto.commit.interval.ms", "2000");
            FlinkKafkaConsumer<String> kafka = new FlinkKafkaConsumer<>("movie", new SimpleStringSchema(), prop);
            kafka.setStartFromGroupOffsets(); // 设置从 offset 开始消费
            DataStreamSource<String> kafkaDS = env.addSource(kafka);
            SingleOutputStreamOperator<RatingBean> beanDS = kafkaDS.map((MapFunction<String, RatingBean>) s
                    -> JSON.parseObject(s, RatingBean.class));
            // 将评分数据插入 ratings 表
            beanDS.addSink(new RatingsTableSink());
            // 计算平均分, 评分次数并更新 movies 表
            SingleOutputStreamOperator<Tuple2<Integer, Tuple2<Double, Integer>>> dataDS = beanDS
                    .map(bean -> new Tuple2<>(bean.getMovieId(), new Tuple2<>(bean.getRating(), 1)))
                    .returns(Types.TUPLE(Types.INT, Types.TUPLE(Types.DOUBLE, Types.INT)))
                    .keyBy(tuple -> tuple.f0)
                    .reduce((ReduceFunction<Tuple2<Integer, Tuple2<Double, Integer>>>) (t1, t2)
                            -> new Tuple2<>(t1.f0, new Tuple2<>((t1.f1.f0 * t1.f1.f1 + t2.f1.f0 * t2.f1.f1) / (t1.f1.f1 + t2.f1.f1), t1.f1.f1 + t2.f1.f1)));
            dataDS.addSink(new MoviesTableSink());
            // 滑动窗口, 统计最近 n 时间的热门电影
            SingleOutputStreamOperator<Tuple2<Integer, Integer>> windowDS1 = beanDS
                    .map(bean -> new Tuple2<>(bean.getMovieId(), 1))
                    .returns(Types.TUPLE(Types.INT, Types.INT))
                    .keyBy(tuple -> tuple.f0)
                    .window(TumblingProcessingTimeWindows.of(Time.seconds(10)))
                    .sum(1);
            windowDS1.addSink(new HotTableSink());
            // 滑动窗口, 统计最近 n 时间的评分次数
            SingleOutputStreamOperator<Tuple2<String, Integer>> windowDS2 = beanDS
                    .map(bean -> new Tuple2<>("window", 1))
                    .returns(Types.TUPLE(Types.STRING, Types.INT))
                    .keyBy(tuple -> tuple.f0)
                    .window(TumblingProcessingTimeWindows.of(Time.seconds(10)))
                    .sum(1);
            windowDS2.addSink(new TsRatingsTableSink());
            env.execute();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
