package com.example.calenderapi.repository;

import com.example.calenderapi.dto.Calender;
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

}
