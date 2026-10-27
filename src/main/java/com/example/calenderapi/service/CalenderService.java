package com.example.calenderapi.service;

import com.example.calenderapi.dto.Calender;
import com.example.calenderapi.repository.CalenderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalenderService {
    private final CalenderRepository calenderRepository;

    public CalenderService(CalenderRepository calenderRepository) {
        this.calenderRepository = calenderRepository;
    }

    public List<Calender> findAll() {
        return calenderRepository.findAll();
    }

    public Calender save(Calender calender) {
        calenderRepository.insertCarender(calender);
        return calender;
    }
}
