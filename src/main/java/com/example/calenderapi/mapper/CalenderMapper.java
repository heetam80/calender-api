package com.example.calenderapi.mapper;

import com.example.calenderapi.dto.Calender;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CalenderMapper {

    @Select("""
        SELECT id, dates, title, content, category, created_at
        FROM calenders
        ORDER BY created_at DESC
        """)
    List<Calender> findAll();

    @Insert("""
        INSERT INTO calenders (dates, title, content, category)
        VALUES (#{dates}, #{title}, #{content}, #{category})
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
    int insert(Calender calender);

    @Select("""
        SELECT id, dates, title, content, category, created_at
        FROM calenders
        WHERE id = #{id}
        """)
    Calender findById(long id);
}