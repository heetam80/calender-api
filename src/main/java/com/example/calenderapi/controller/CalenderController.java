package com.example.calenderapi.controller;

import com.example.calenderapi.dto.Calender;
import com.example.calenderapi.service.CalenderService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
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

//        return new ResponseEntity<>(calenders, HttpStatus.OK);
        return ResponseEntity.ok(calenders);
    }

    @PostMapping
    public ResponseEntity<Calender> saveCalender(@RequestBody Calender calender,
                                                UriComponentsBuilder uriBuilder) {
        Calender createdCalender = calenderService.saveCalender(calender);

        URI location = uriBuilder.path("api/calenders/{id}")
                .buildAndExpand(createdCalender.getId()).toUri();

//        HttpHeaders headers = new HttpHeaders();
//        headers.setLocation(location);
//
//        return new ResponseEntity<>(createdCalender, headers, HttpStatus.CREATED);

        return ResponseEntity.created(location).body(createdCalender);

    }

    @GetMapping("/{id}")
    public ResponseEntity<Calender> findById(@PathVariable Long id) {
        Calender calender = calenderService.findById(id);

        return ResponseEntity.ok(calender);
    }


}