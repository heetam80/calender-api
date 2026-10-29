package com.example.calenderapi.exception;

public class CalenderNotFoundException extends RuntimeException {

    public CalenderNotFoundException(long id) {
        super("指定されたIDのノートが見つかりません：" + id);
    }
}