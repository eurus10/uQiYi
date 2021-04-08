package cn.edu.neu.movie.dao;

import cn.edu.neu.movie.bean.RatingQueryResultBean;

import java.sql.*;
import java.util.ArrayList;

public class RatingQueryMapper {
    public static ArrayList<RatingQueryResultBean> queryRatings(int movieId) {
        ArrayList<RatingQueryResultBean> ratings = new ArrayList<>();
        try {
            Class.forName(DataBase.DRIVER);
            Connection conn = DriverManager.getConnection(DataBase.URL, DataBase.USR, DataBase.PSW);
            PreparedStatement ps = conn.prepareStatement("select movies.movie_id as movie_id, title, user_id, rating " +
                    "from movies join ratings on movies.movie_id=ratings.movie_id where movies.movie_id=?");
            ps.setInt(1, movieId);
            ResultSet result = ps.executeQuery();
            while (result.next()) {
                String title = result.getString("title");
                int userId = result.getInt("user_id");
                double rating = result.getDouble("rating");
                ratings.add(new RatingQueryResultBean(movieId, title, userId, rating));
            }
            result.close();
            ps.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ratings;
    }
}
