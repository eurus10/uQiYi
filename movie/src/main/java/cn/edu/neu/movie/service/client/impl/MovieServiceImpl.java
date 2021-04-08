package cn.edu.neu.movie.service.client.impl;

import cn.edu.neu.movie.bean.HotBean;
import cn.edu.neu.movie.dao.MovieMapper;
import cn.edu.neu.movie.service.client.MovieService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieServiceImpl implements MovieService {
    @Override
    public List<HotBean> queryHot() {
        return MovieMapper.queryHotMovies();
    }
}
