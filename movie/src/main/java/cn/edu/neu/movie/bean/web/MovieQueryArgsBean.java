package cn.edu.neu.movie.bean.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieQueryArgsBean {
    private double minAvgRating;
    private int minCount;
    private boolean useCount;
}
