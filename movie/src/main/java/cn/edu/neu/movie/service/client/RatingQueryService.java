package cn.edu.neu.movie.service.client;

import cn.edu.neu.movie.bean.RatingQueryResultBean;

import java.util.List;

public interface RatingQueryService {
    List<RatingQueryResultBean> query(int movieId);
}
