package cn.edu.neu.movie.controller;

import cn.edu.neu.movie.bean.MovieBean;
import cn.edu.neu.movie.bean.web.MovieQueryArgsBean;
import cn.edu.neu.movie.service.client.MovieQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MovieQueryController {
    @Autowired
    private MovieQueryService service;

    @CrossOrigin
    @RequestMapping("/movie_query/query")
    public List<MovieBean> queryMovies(@RequestBody MovieQueryArgsBean args) {
        return service.query(args.getMinAvgRating(), args.getMinCount(), args.isUseCount(), 50);
    }
}
