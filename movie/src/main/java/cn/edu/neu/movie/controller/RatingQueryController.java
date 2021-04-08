package cn.edu.neu.movie.controller;

import cn.edu.neu.movie.bean.RatingQueryResultBean;
import cn.edu.neu.movie.service.client.RatingQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class RatingQueryController {
    @Autowired
    private RatingQueryService service;

    @CrossOrigin
    @RequestMapping("/rating_query/query")
    public List<RatingQueryResultBean> queryRatings(@RequestBody Map<String, Integer> args) {
        return service.query(args.get("movieId"));
    }
}
