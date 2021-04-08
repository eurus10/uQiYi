package cn.edu.neu.movie.service.client.impl;

import cn.edu.neu.movie.bean.RatingQueryResultBean;
import cn.edu.neu.movie.dao.RatingQueryMapper;
import cn.edu.neu.movie.service.client.RatingQueryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingQueryServiceImple implements RatingQueryService {
    @Override
    public List<RatingQueryResultBean> query(int movieId) {
        return RatingQueryMapper.queryRatings(movieId);
    }
}
