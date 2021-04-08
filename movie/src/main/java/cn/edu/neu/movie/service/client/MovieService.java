package cn.edu.neu.movie.service.client;

import cn.edu.neu.movie.bean.HotBean;

import java.util.List;

public interface MovieService {
    List<HotBean> queryHot();
}
