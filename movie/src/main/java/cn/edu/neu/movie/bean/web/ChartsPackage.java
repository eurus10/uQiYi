package cn.edu.neu.movie.bean.web;

import lombok.Data;

@Data
public class ChartsPackage {
    private DoubleDataChartBean<Double, Integer> chart1;
    private SingleObjectChartBean<Integer, Double> chart2;
    private DoubleDataChartBean<Integer, Integer> chart3;
    private DoubleDataChartBean<Integer, Integer> chart4;
    private DoubleDataChartBean<Integer, Double> chart5;
    private DoubleDataChartBean<Integer, Integer> chart6;
    private SingleObjectChartBean<Integer, String> chart7;

    public ChartsPackage() {
        chart1 = new DoubleDataChartBean<>();
        chart2 = new SingleObjectChartBean<>();
        chart3 = new DoubleDataChartBean<>();
        chart4 = new DoubleDataChartBean<>();
        chart5 = new DoubleDataChartBean<>();
        chart6 = new DoubleDataChartBean<>();
        chart7 = new SingleObjectChartBean<>();
    }

    public void pushIntoChart1(double x, int y) {
        chart1.push(x, y);
    }

    public void pushIntoChart2(int value, double name) {
        chart2.push(value, name);
    }

    public void pushIntoChart3(int x, int y) {
        chart3.push(x, y);
    }

    public void pushIntoChart4(int x, int y) {
        chart4.push(x, y);
    }

    public void pushIntoChart5(int x, double y) {
        chart5.push(x, y);
    }

    public void pushIntoChart6(int x, int y) {
        chart6.push(x, y);
    }

    public void pushIntoChart7(int value, String name) {
        chart7.push(value, name);
    }
}
