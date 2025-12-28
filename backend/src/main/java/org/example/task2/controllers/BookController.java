package org.example.task2.controllers;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.task2.Dto.*;
import org.example.task2.entity.Book;
import org.example.task2.services.BookService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3050")
public class BookController {

    private final BookService bookService;

    @PostMapping(value = "/report", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void generateReport(HttpServletResponse httpServletResponse) {
        bookService.generateReport(httpServletResponse);
    }

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.CREATED)
    public RestResponse uploadJson(@RequestParam("file") MultipartFile multipartFile) {
        int count = bookService.uploadJson(multipartFile);
        return new RestResponse(count + " books uploaded");
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Book> getBooks() {
        return  bookService.getBooks();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RestResponse createBook(@RequestBody BookCreateDTO dto) {
        int id = Math.toIntExact(bookService.createBook(dto).getId());
        return new RestResponse(String.valueOf(id));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Book getBookById(@Valid @PathVariable int id) {
        return bookService.getBookById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RestResponse updateBook(@PathVariable int id, @RequestBody BookCreateDTO dto) {
        bookService.updateBook(id, dto);
        return new RestResponse("The book with id %d has been updated".formatted(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RestResponse deleteBook(@PathVariable int id) {
        bookService.deleteBook(id);
        return new RestResponse("The book with id %d has been removed".formatted(id));
    }

    @PostMapping("/_list")
    @ResponseStatus(HttpStatus.OK)
    public BookListResponse getBooksList (@RequestBody BookListRequest request) {
        return bookService.getBookListPage(request);
    }
}
