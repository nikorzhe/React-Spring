package org.example.task2.Dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class BookUploadDTO {
    @JsonProperty("title")
    private String title;

    @JsonProperty("genre")
    private String genre;

    @JsonProperty("yearPublished")
    private Integer yearPublished;

    @JsonProperty("authorId")
    private Integer authorId;
}