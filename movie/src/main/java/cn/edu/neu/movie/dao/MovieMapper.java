package cn.edu.neu.movie.dao;

import cn.edu.neu.movie.bean.HotBean;

import java.sql.*;
import java.util.ArrayList;

public class MovieMapper {
    public static ArrayList<HotBean> queryHotMovies() {
        ArrayList<HotBean> hotBeans = new ArrayList<>();
        try {
            Class.forName(DataBase.DRIVER);
            Connection conn = DriverManager.getConnection(DataBase.URL, DataBase.USR, DataBase.PSW);
            Statement s = conn.createStatement();
            ResultSet result = s.executeQuery("select movies.movie_id as movie_id, title, hot.`count` as `count` " +
                    "from movies join hot on movies.movie_id=hot.movie_id order by `count` desc");
            while (result.next()) {
                int movieId = result.getInt("movie_id");
                String title = result.getString("title");
                int count = result.getInt("count");
                hotBeans.add(new HotBean(movieId, title, count));
            }
            result.close();
            s.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return hotBeans;
    }

    public static void clearHotMovies() {
        try {
            Class.forName(DataBase.DRIVER);
            Connection conn = DriverManager.getConnection(DataBase.URL, DataBase.USR, DataBase.PSW);
            Statement s = conn.createStatement();
            s.execute("delete from hot");
            s.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void updateHotMovies(int movieId, int count) {
        try {
            Class.forName(DataBase.DRIVER);
            Connection conn = DriverManager.getConnection(DataBase.URL, DataBase.USR, DataBase.PSW);
            PreparedStatement ps = conn.prepareStatement("insert into hot values (?, ?)");
            ps.setInt(1, movieId);
            ps.setInt(2, count);
            ps.execute();
            ps.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
