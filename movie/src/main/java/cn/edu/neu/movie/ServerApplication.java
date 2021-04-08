package cn.edu.neu.movie;

import cn.edu.neu.movie.service.server.Processor;

public class ServerApplication {
    public static void main(String[] args) {
        Processor processor = new Processor();
        processor.run();
    }
}
