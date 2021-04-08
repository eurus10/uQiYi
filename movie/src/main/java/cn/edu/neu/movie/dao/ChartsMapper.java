package cn.edu.neu.movie.dao;

import cn.edu.neu.movie.bean.GenresCountBean;
import cn.edu.neu.movie.bean.MovieBean;
import cn.edu.neu.movie.bean.RatingDistBean;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;

public class ChartsMapper {
    public static ArrayList<RatingDistBean> queryRatingDistribution() {
        ArrayList<RatingDistBean> ratingDists = new ArrayList<>();
        try {
            Class.forName(DataBase.DRIVER);
            Connection conn = DriverManager.getConnection(DataBase.URL, DataBase.USR, DataBase.PSW);
            Statement s = conn.createStatement();
            ResultSet result = s.executeQuery("select rating, count(1) as total_count from ratings group by rating");
            while (result.next()) {
                double rating = result.getDouble("rating");
                int count = result.getInt("total_count");
                ratingDists.add(new RatingDistBean(rating, count));
            }
            result.close();
            s.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ratingDists;
    }

    public static int queryTotalCount() {
        try {
            Class.forName(DataBase.DRIVER);
            Connection conn = DriverManager.getConnection(DataBase.URL, DataBase.USR, DataBase.PSW);
            Statement s = conn.createStatement();
            ResultSet result = s.executeQuery("select count(1) as total_count from ratings");
            result.next();
            return result.getInt("total_count");
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public static ArrayList<Integer> queryTsRatingsCountHistory() {
        ArrayList<Integer> history = new ArrayList<>();
        try {
            Class.forName(DataBase.DRIVER);
            Connection conn = DriverManager.getConnection(DataBase.URL, DataBase.USR, DataBase.PSW);
            Statement s = conn.createStatement();
            ResultSet result = s.executeQuery("select * from ts_ratings");
            while (result.next()) {
                history.add(result.getInt("count"));
            }
            result.close();
            s.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return history;
    }

    public static ArrayList<MovieBean> queryTop5Movies(String order) {
        ArrayList<MovieBean> movies = new ArrayList<>();
        try {
            Class.forName(DataBase.DRIVER);
            Connection conn = DriverManager.getConnection(DataBase.URL, DataBase.USR, DataBase.PSW);
            Statement s = conn.createStatement();
            ResultSet result = s.executeQuery("select * from movies order by " + order + " desc limit 5");
            while (result.next()) {
                int movieId = result.getInt("movie_id");
                String title = result.getString("title");
                String genres = result.getString("genres");
                double avgRating = result.getDouble("avg_rating");
                int count = result.getInt("count");
                movies.add(new MovieBean(movieId, title, genres, avgRating, count));
            }
            result.close();
            s.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return movies;
    }

    public static ArrayList<GenresCountBean> queryTop5Genres() {
        ArrayList<GenresCountBean> genresCounts = new ArrayList<>();
        try {
            Class.forName(DataBase.DRIVER);
            Connection conn = DriverManager.getConnection(DataBase.URL, DataBase.USR, DataBase.PSW);
            Statement s = conn.createStatement();
            ResultSet result = s.executeQuery("select genres, sum(`count`) as total_count from movies " +
                    "group by genres order by total_count desc limit 5");
            while (result.next()) {
                String genres = result.getString("genres");
                int count = result.getInt("total_count");
                genresCounts.add(new GenresCountBean(genres, count));
            }
            result.close();
            s.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return genresCounts;
    }
}
