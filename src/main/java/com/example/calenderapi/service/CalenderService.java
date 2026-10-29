    package com.example.calenderapi.service;

    import com.example.calenderapi.dto.Calender;
    import com.example.calenderapi.exception.CalenderArgumentNotValidException;
    import com.example.calenderapi.exception.CalenderNotFoundException;
    import com.example.calenderapi.repository.CalenderRepository;
    import org.springframework.http.ResponseEntity;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;
    import org.springframework.web.bind.annotation.ExceptionHandler;

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

            if (calender.getTitle() == null || calender.getTitle().isEmpty()) {
                throw new CalenderArgumentNotValidException("title is empty");
            }

            if (calender.getContent() == null || calender.getContent().isEmpty()) {
                throw new CalenderArgumentNotValidException("content is empty");
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

        public boolean delete(long id) {
            if(!calenderRepository.delete(id)) {
                throw new CalenderNotFoundException(id);
            }
            return true;
        }

        @Transactional
        public Calender update(Calender calender, long id){
            if (calender.getTitle() == null || calender.getTitle().isEmpty()) {
                throw new CalenderArgumentNotValidException("title is empty");
            }

            if (calender.getContent() == null || calender.getContent().isEmpty()) {
                throw new CalenderArgumentNotValidException("content is empty");
            }

            Calender targetCalender = calenderRepository.findById(id);
            if(targetCalender == null){
                throw new CalenderNotFoundException(id);
            }

            calender.setId(id);
            calender.setCreatedAt(targetCalender.getCreatedAt());
            return calenderRepository.update(calender);
        }

    }
