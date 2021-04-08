package cn.edu.neu.movie.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingQueryResultBean {
    private int movieId;
    private String title;
    private int userId;
    private double rating;
}
