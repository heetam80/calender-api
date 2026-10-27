package com.example.calenderapi.service;

import com.example.calenderapi.dto.Calender;
import com.example.calenderapi.exception.CalenderNotFoundException;
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

    public Calender saveCalender(Calender calender) {

        if(calender.getTitle() == null || calender.getTitle().isEmpty()) {
            throw new CalenderNotFoundException("title is empty");
        }

        if(calender.getContent() == null || calender.getContent().isEmpty()) {
            throw new CalenderNotFoundException("content is empty");
        }

        calenderRepository.insertCarender(calender);
        return calender;
    }

    public Calender findById(long id) {
        Calender calender = calenderRepository.findById(id);

        if(calender == null){
            throw new CalenderNotFoundException(id);
        }

        return calender;
    }

}
