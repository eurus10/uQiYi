package cn.edu.neu.movie.bean.web;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class SingleObjectChartBean<V, N> {
    private List<SingleObject<V, N>> data;
    private int size;

    public SingleObjectChartBean() {
        data = new ArrayList<>();
        size = 0;
    }

    public void push(V value, N name) {
        data.add(new SingleObject<>(value, name));
    }

    public int size() {
        return size;
    }

    public static class SingleObject<V, N> {
        private V value;
        private N name;

        public SingleObject(V value, N name) {
            this.value = value;
            this.name = name;
        }

        public V getValue() {
            return value;
        }

        public void setValue(V value) {
            this.value = value;
        }

        public N getName() {
            return name;
        }

        public void setName(N name) {
            this.name = name;
        }
    }
}
