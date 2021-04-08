package cn.edu.neu.movie.service.server;

import cn.edu.neu.movie.dao.DataBase;
import org.apache.flink.api.java.tuple.Tuple2;
import org.apache.flink.streaming.api.functions.sink.RichSinkFunction;

public class MoviesTableSink extends RichSinkFunction<Tuple2<Integer, Tuple2<Double, Integer>>> {
    @Override
    public void invoke(Tuple2<Integer, Tuple2<Double, Integer>> value, Context context) throws Exception {
        DataBase.updateMovies(value.f0, value.f1.f0, value.f1.f1);
    }
}
