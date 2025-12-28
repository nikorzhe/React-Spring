package org.example.task2.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
public class BookListResponse {
    private List<BookListItem> list;
    private int totalPages;
    private long totalElements;
    private int currentPage;
    private int size;
}
