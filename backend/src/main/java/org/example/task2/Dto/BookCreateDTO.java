package org.example.task2.Dto;

import lombok.Data;
import lombok.Getter;


@Data
public class BookCreateDTO {
    private String title;
    private String genre;
    private Integer yearPublished;
    private Integer authorId;
}
