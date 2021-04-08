package cn.edu.neu.movie.service.client;

import cn.edu.neu.movie.bean.MovieBean;

import java.util.List;

public interface MovieQueryService {
    List<MovieBean> query(double minAvgRating, int minCount, boolean useCount, int n);
}
