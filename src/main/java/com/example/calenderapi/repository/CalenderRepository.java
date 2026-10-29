package com.example.calenderapi.repository;

import com.example.calenderapi.dto.Calender;
import com.example.calenderapi.exception.CalenderNotFoundException;
import com.example.calenderapi.mapper.CalenderMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class  CalenderRepository {
    private final CalenderMapper calenderMapper;

    public CalenderRepository(CalenderMapper calenderMapper) {
        this.calenderMapper = calenderMapper;
    }

    public List<Calender> findAll(){
        return calenderMapper.findAll();
    }

    public int insertCarender(Calender calender) {
        return calenderMapper.insert(calender);
    }

    public Calender findById(long id){
        return calenderMapper.findById(id);
    }

    public boolean delete(long id) {
        return calenderMapper.delete(id) == 1;
    }

    public Calender update(Calender calender) {
        if(calenderMapper.update(calender) == 0){
            throw new CalenderNotFoundException(calender.getId());
        }
        return calender;
    }

}
