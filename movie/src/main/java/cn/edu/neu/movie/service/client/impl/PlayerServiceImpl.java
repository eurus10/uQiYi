package cn.edu.neu.movie.service.client.impl;

import cn.edu.neu.movie.bean.RatingBean;
import cn.edu.neu.movie.service.client.PlayerService;
import cn.edu.neu.movie.util.Kafka;
import com.alibaba.fastjson.JSON;
import org.springframework.stereotype.Service;

@Service
public class PlayerServiceImpl implements PlayerService {
    @Override
    public void rate(RatingBean bean) {
        Kafka.send(Kafka.DEFAULT_TOPIC, "key", JSON.toJSONString(bean));
    }
}
