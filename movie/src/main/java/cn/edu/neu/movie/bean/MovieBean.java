package cn.edu.neu.movie.bean;

import cn.edu.neu.movie.util.CSVObjectInitializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieBean implements CSVObjectInitializable {
    private int movieId;
    private String title;
    private String genres;
    private double avgRating;
    private int count;

    @Override
    public CSVObjectInitializable initFromCSV(String csv, String sep) {
        String[] tokens = csv.trim().split(sep);
        try {
            movieId = Integer.parseInt(tokens[0]);
        } catch (NumberFormatException e) {
            e.printStackTrace();
            movieId = -1;
        }
        title = tokens[1];
        genres = tokens[2].split("\\|")[0];
        avgRating = 0;
        count = 0;
        return this;
    }
}
