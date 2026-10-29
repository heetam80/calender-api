package com.example.calenderapi.exception.handler;

import com.example.calenderapi.dto.Calender;
import com.example.calenderapi.exception.CalenderArgumentNotValidException;
import com.example.calenderapi.exception.CalenderNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CalenderNotFoundException.class)
    public ResponseEntity<String> handleCalenderNotFoundException(CalenderNotFoundException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
//        return ResponseEntity.notFound().build();
    }
}
