package org.example.task2.Dto;

import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class BookDetailsDTO {
    private int id;
    private String title;
    private String genre;
    private Long year_published;
}
