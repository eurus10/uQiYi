package cn.edu.neu.movie.bean.web;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class DoubleDataChartBean<T, P> {
    private List<T> x;
    private List<P> y;
    private int size;

    public DoubleDataChartBean() {
        x = new ArrayList<>();
        y = new ArrayList<>();
        size = 0;
    }

    public void push(T xEle, P yEle) {
        x.add(xEle);
        y.add(yEle);
        size++;
    }

    public int size() {
        return size;
    }
}
