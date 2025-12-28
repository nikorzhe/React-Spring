package org.example.task2.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.task2.Dto.AuthorCreateDTO;
import org.example.task2.Dto.RestResponse;
import org.example.task2.entity.Author;
import org.example.task2.services.AuthorService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/authors")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorService authorService;


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RestResponse createBook(@RequestBody AuthorCreateDTO dto) {
        int id = Math.toIntExact(authorService.createAuthor(dto).getId());
        return new RestResponse(String.valueOf(id));
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Author getBookById(@Valid @PathVariable int id) {
        return authorService.getAuthorById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RestResponse updateBook(@PathVariable int id, @RequestBody AuthorCreateDTO dto) {
        authorService.updateAuthor(id, dto);
        return new RestResponse("The book with id %d has been updated".formatted(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RestResponse deleteBook(@PathVariable int id) {
        authorService.deleteAuthor(id);
        return new RestResponse("The book with id %d has been removed".formatted(id));
    }

}
