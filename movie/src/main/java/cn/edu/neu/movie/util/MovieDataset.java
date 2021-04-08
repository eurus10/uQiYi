package cn.edu.neu.movie.util;

import cn.edu.neu.movie.bean.MovieBean;

public class MovieDataset extends Dataset<MovieBean> {
    public MovieDataset(String url) {
        super(url);
    }

    @Override
    public MovieBean next() {
        if (hasNext()) {
            String csv = in.nextLine();
            if (!csv.equals("")) {
                return (MovieBean) new MovieBean().initFromCSV(csv, ";");
            } else return next();
        } else return null;
    }
}
