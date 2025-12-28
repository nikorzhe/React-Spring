package org.example.task2.Dto;

import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class BookListRequest {
    private String genre;
    private Integer authorId;
    private Integer yearPublished;

    private int page = 0;
    private int size = 10;
}
