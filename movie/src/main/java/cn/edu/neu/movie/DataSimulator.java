package cn.edu.neu.movie;

import cn.edu.neu.movie.bean.RatingBean;
import cn.edu.neu.movie.dao.DataBase;
import cn.edu.neu.movie.service.sim.SimSource;
import cn.edu.neu.movie.util.Message;
import com.alibaba.fastjson.JSON;
import org.apache.flink.api.common.RuntimeExecutionMode;
import org.apache.flink.api.common.functions.MapFunction;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.datastream.SingleOutputStreamOperator;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.connectors.kafka.FlinkKafkaProducer;

import java.util.Properties;
import java.util.Scanner;

public class DataSimulator {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        System.out.print(">>> ");
        String code = in.next();
        if (code.equals("init")) {
            initDataBase();
            Message.info("Database init finished");
        } else produce();
    }

    public static void produce() {
        try {
            StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
            env.setRuntimeMode(RuntimeExecutionMode.AUTOMATIC);
            DataStreamSource<RatingBean> ds = env.addSource(new SimSource()).setParallelism(2);
            SingleOutputStreamOperator<String> jsonDS = ds.map((MapFunction<RatingBean, String>) JSON::toJSONString);
            // 输出到控制台
            jsonDS.print();
            // 创建 Kafka Producer
            Properties prop = new Properties();
            prop.setProperty("bootstrap.servers", "localhost:9092");
            FlinkKafkaProducer<String> kafka = new FlinkKafkaProducer<>("movie", new SimpleStringSchema(), prop);
            jsonDS.addSink(kafka);
            env.execute();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void initDataBase() {
        DataBase.init();
    }
}
