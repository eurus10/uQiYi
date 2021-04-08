package cn.edu.neu.movie.dao;

import cn.edu.neu.movie.bean.MovieBean;

import java.sql.*;
import java.util.ArrayList;

public class MovieQueryMapper {
    public static ArrayList<MovieBean> queryMovies(double minAvgRating, int minCount, String order, int n) {
        ArrayList<MovieBean> movies = new ArrayList<>();
        try {
            Class.forName(DataBase.DRIVER);
            Connection conn = DriverManager.getConnection(DataBase.URL, DataBase.USR, DataBase.PSW);
            PreparedStatement ps = conn.prepareStatement("select * from movies where avg_rating >= ? and `count` >= ? " +
                    "order by " + order + " desc limit " + n);
            ps.setDouble(1, minAvgRating);
            ps.setInt(2, minCount);
            ResultSet result = ps.executeQuery();
            while (result.next()) {
                int movieId = result.getInt("movie_id");
                String title = result.getString("title");
                String genres = result.getString("genres");
                double avgRating = result.getDouble("avg_rating");
                int count = result.getInt("count");
                movies.add(new MovieBean(movieId, title, genres, avgRating, count));
            }
            result.close();
            ps.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return movies;
    }
}
