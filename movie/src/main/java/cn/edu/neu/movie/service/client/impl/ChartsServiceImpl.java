package cn.edu.neu.movie.service.client.impl;

import cn.edu.neu.movie.bean.GenresCountBean;
import cn.edu.neu.movie.bean.MovieBean;
import cn.edu.neu.movie.bean.RatingDistBean;
import cn.edu.neu.movie.bean.web.ChartsPackage;
import cn.edu.neu.movie.dao.ChartsMapper;
import cn.edu.neu.movie.service.client.ChartsService;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

@Service
public class ChartsServiceImpl implements ChartsService {
    private Queue<Integer> history = new LinkedList<>();

    @Override
    public ChartsPackage query() {
        ChartsPackage charts = new ChartsPackage();
        // query and store data of chart1, chart2
        List<RatingDistBean> ratingDistBeanList = ChartsMapper.queryRatingDistribution();
        charts.getChart1().push(0., 0);
        ratingDistBeanList.forEach(bean -> {
            charts.getChart1().push(bean.getRating(), bean.getCount());
            charts.getChart2().push(bean.getCount(), bean.getRating());
        });
        // query and store data of chart3
        List<Integer> tsRatingsCountList = ChartsMapper.queryTsRatingsCountHistory();
        for (int i = 0; i < tsRatingsCountList.size(); i++) {
            charts.getChart3().push(i, tsRatingsCountList.get(i));
        }
        // query and store data of chart4
        if (history.size() == 10) {
            history.poll();
        }
        history.offer(ChartsMapper.queryTotalCount());
        Queue<Integer> cache = new LinkedList<>();
        int max = history.size();
        for (int i = 0; i < max; i++) {
            int count = history.poll();
            charts.getChart4().push(i, count);
            cache.offer(count);
        }
        history = cache;
        // query and store data of chart5
        List<MovieBean> topAvgRatingList = ChartsMapper.queryTop5Movies("avg_rating");
        charts.getChart5().push(0, 0.);
        topAvgRatingList.forEach(movie -> charts.getChart5().push(movie.getMovieId(), movie.getAvgRating()));
        // query and store data of chart6
        List<MovieBean> topCountList = ChartsMapper.queryTop5Movies("count");
        charts.getChart6().push(0, 0);
        topCountList.forEach(movie -> charts.getChart6().push(movie.getMovieId(), movie.getCount()));
        // query and store data of chart7
        List<GenresCountBean> genresCountBeanList = ChartsMapper.queryTop5Genres();
        genresCountBeanList.forEach(bean -> charts.getChart7().push(bean.getCount(), bean.getGenres()));
        return charts;
    }
}
