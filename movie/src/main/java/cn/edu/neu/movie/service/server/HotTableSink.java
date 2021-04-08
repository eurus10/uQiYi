package cn.edu.neu.movie.service.server;

import cn.edu.neu.movie.dao.MovieMapper;
import org.apache.flink.api.java.tuple.Tuple2;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.functions.sink.RichSinkFunction;


public class HotTableSink extends RichSinkFunction<Tuple2<Integer, Integer>> {
    private long start;
    
    @Override
    public void open(Configuration parameters) {
        start = System.currentTimeMillis();
        MovieMapper.clearHotMovies();
    }

    @Override
    public void invoke(Tuple2<Integer, Integer> value, Context context) {
        long now = System.currentTimeMillis();
        if ((now - start) / 1000 >= 10) {
            start = now;
            MovieMapper.clearHotMovies();
        }
        MovieMapper.updateHotMovies(value.f0, value.f1);
    }
}