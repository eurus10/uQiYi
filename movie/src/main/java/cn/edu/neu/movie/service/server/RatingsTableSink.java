package cn.edu.neu.movie.service.server;

import cn.edu.neu.movie.bean.RatingBean;
import cn.edu.neu.movie.dao.DataBase;
import org.apache.flink.streaming.api.functions.sink.RichSinkFunction;

public class RatingsTableSink extends RichSinkFunction<RatingBean> {
    @Override
    public void invoke(RatingBean value, Context context) {
        DataBase.newRating(value);
    }
}
