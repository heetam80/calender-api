package com.example.calenderapi.controller;

import com.example.calenderapi.dto.Calender;
import com.example.calenderapi.service.CalenderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/calenders")
public class CalenderController {

    private final CalenderService calenderService;

    public CalenderController(CalenderService calenderService) {
        this.calenderService = calenderService;
    }

    @GetMapping
    public ResponseEntity<List<Calender>> findAllCalenders() {
        List<Calender> calenders = calenderService.findAll();

        return new ResponseEntity<>(calenders, HttpStatus.OK);
    }

    public ResponseEnity<Calender> saveCalender(@RequestBody Calender calender) {

    }

}