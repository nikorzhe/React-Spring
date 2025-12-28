package org.example.task2.Dto;

import com.fasterxml.jackson.core.JsonToken;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@Builder
public class BookListItem {
    private Long id;
    private String title;
    private String genre;
    private Integer yearPublished;
    private String authorName;

}
