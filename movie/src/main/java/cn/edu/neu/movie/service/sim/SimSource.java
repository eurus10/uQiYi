package cn.edu.neu.movie.service.sim;

import cn.edu.neu.movie.bean.RatingBean;
import cn.edu.neu.movie.util.Simulator;
import org.apache.flink.streaming.api.functions.source.RichParallelSourceFunction;

import java.util.Random;

public class SimSource extends RichParallelSourceFunction<RatingBean> {
    private Simulator simulator = new Simulator().run(100);
    private boolean flag = true;

    @Override
    public void run(SourceContext<RatingBean> sourceContext) throws Exception {
        while (flag) {
            RatingBean bean = simulator.next();
            if (bean != null) {
                Random random = new Random();
                long gap = random.nextInt(3) * 1000 + 500;
                Thread.sleep(gap);
                sourceContext.collect(bean);
            } else break;
        }
    }

    @Override
    public void cancel() {
        flag = false;
    }
}
