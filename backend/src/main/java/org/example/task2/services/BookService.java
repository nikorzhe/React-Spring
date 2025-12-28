package org.example.task2.services;

import jakarta.servlet.http.HttpServletResponse;
import org.example.task2.Dto.BookCreateDTO;
import org.example.task2.Dto.BookListRequest;
import org.example.task2.Dto.BookListResponse;
import org.example.task2.entity.Book;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public interface BookService {

    Book createBook(BookCreateDTO bookCreateDTO);

    Book getBookById(int id);


    List<Book> getBooks();

    Book updateBook(int id, BookCreateDTO dto);

    void deleteBook(int id);

    int uploadJson(MultipartFile file);

    void generateReport(HttpServletResponse httpServletResponse);

    BookListResponse getBookListPage(BookListRequest request);

//    List<Book> booksByGenre(String genre, Pageable paging);
}
