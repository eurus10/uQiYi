package cn.edu.neu.movie.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingBean implements Serializable {
    private int userId;
    private int movieId;
    private double rating;
}
