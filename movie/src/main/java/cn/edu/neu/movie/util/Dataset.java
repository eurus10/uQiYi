package cn.edu.neu.movie.util;

import java.util.Scanner;

public abstract class Dataset<T> {
    protected Scanner in;

    public Dataset(String url) {
        in = new Scanner(Dataset.class.getResourceAsStream(url));
    }

    public boolean hasNext() {
        return in != null && in.hasNextLine();
    }

    public abstract T next();
}
