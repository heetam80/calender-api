package com.example.calenderapi.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class Calender {
    private long id;
    private LocalDate dates;  //予定の日付
    private String title;
    private String content;
    private String category; //タグ
    private LocalDateTime createdAt;
}
