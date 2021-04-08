package cn.edu.neu.movie.dao;

import cn.edu.neu.movie.bean.MovieBean;
import cn.edu.neu.movie.bean.RatingBean;
import cn.edu.neu.movie.util.Dataset;
import cn.edu.neu.movie.util.MovieDataset;

import java.sql.*;

public class DataBase {
    public static final String DRIVER = "com.mysql.jdbc.Driver";
    public static final String URL = "jdbc:mysql://localhost:3306/movie?characterEncoding=UTF-8";
    public static final String USR = "root";
    public static final String PSW = "root";

    public static void init() {
        try {
            Class.forName(DRIVER);
            Connection conn = DriverManager.getConnection(URL, USR, PSW);
            Statement s = conn.createStatement();
            s.execute("delete from movies");
            s.execute("delete from ratings");
            s.execute("delete from hot");
            s.execute("delete from ts_ratings");
            s.close();
            PreparedStatement ps = conn.prepareStatement("insert into movies values (?, ?, ?, ?, ?)");
            Dataset<MovieBean> movies = new MovieDataset("/data/movies.csv");
            while (movies.hasNext()) {
                MovieBean movie = movies.next();
                ps.setInt(1, movie.getMovieId());
                ps.setString(2, movie.getTitle());
                ps.setString(3, movie.getGenres());
                ps.setDouble(4, movie.getAvgRating());
                ps.setInt(5, movie.getCount());
                ps.execute();
            }
            ps.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void newRating(RatingBean bean) {
        try {
            Class.forName(DRIVER);
            Connection conn = DriverManager.getConnection(URL, USR, PSW);
            PreparedStatement ps = conn.prepareStatement("insert into ratings values (?, ?, ?)");
            ps.setInt(1, bean.getUserId());
            ps.setInt(2, bean.getMovieId());
            ps.setDouble(3, bean.getRating());
            ps.execute();
            ps.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void updateMovies(int movieId, double avgRating, int count) {
        try {
            Class.forName(DRIVER);
            Connection conn = DriverManager.getConnection(URL, USR, PSW);
            PreparedStatement ps = conn.prepareStatement("update movies set avg_rating=?, `count`=? where movie_id=?");
            ps.setDouble(1, avgRating);
            ps.setInt(2, count);
            ps.setInt(3, movieId);
            ps.execute();
            ps.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void clearTsRatings() {
        try {
            Class.forName(DRIVER);
            Connection conn = DriverManager.getConnection(URL, USR, PSW);
            Statement s = conn.createStatement();
            s.execute("delete from ts_ratings");
            s.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void updateTsRatings(int count) {
        try {
            Class.forName(DRIVER);
            Connection conn = DriverManager.getConnection(URL, USR, PSW);
            PreparedStatement ps = conn.prepareStatement("insert into ts_ratings values (?)");
            ps.setInt(1, count);
            ps.execute();
            ps.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
