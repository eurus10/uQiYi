package cn.edu.neu.movie.util;

import cn.edu.neu.movie.bean.MovieBean;
import cn.edu.neu.movie.bean.RatingBean;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Random;

public class Simulator implements Serializable {
    private ArrayList<Integer> movies;
    private int users;
    private boolean inited;
    private int movieIdx;

    public Simulator() {
        this.movies = new ArrayList<>();
        Dataset<MovieBean> dataset = new MovieDataset("/data/movies.csv");
        while (dataset.hasNext()) {
            MovieBean movie = dataset.next();
            if (movie != null) movies.add(movie.getMovieId());
        }
        this.users = 0;
        this.inited = false;
    }

    public Simulator run(int users) {
        this.users = users;
        this.inited = true;
        return this;
    }

    public double nextRating(Random random) {
        double rating = (double) Math.round(Math.abs(random.nextGaussian() + 3.2));
        while (rating < 1 || rating > 5) {
            rating = (double) Math.round(Math.abs(random.nextGaussian() + 3.2));
        }
        return rating;
    }

    public RatingBean next() {
        if (inited) {
            Random random = new Random();
            int userId = random.nextInt(users) + 1;
            movieIdx = random.nextDouble() > 0.5 ? random.nextInt(movies.size()) : movieIdx;
            double rating = nextRating(random);
            return new RatingBean(userId, movies.get(movieIdx), rating);
        } else return null;
    }
}
