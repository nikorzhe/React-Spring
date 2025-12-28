package org.example.task2.services;

import lombok.RequiredArgsConstructor;
import org.example.task2.Dto.*;
import org.example.task2.entity.Author;
import org.example.task2.repository.AuthorRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;

    @Override
    public Author createAuthor(AuthorCreateDTO dto) {
        if (dto.getFirstName() == null && dto.getLastName() == null) {
            throw new RuntimeException("firstName and lastname are required");
        }

        Author author = new Author();
        author.setFirstName(dto.getFirstName());
        author.setLastName(dto.getLastName());
        return authorRepository.save(author);
    }

    @Override
    public Author getAuthorById(int id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
    }

    @Override
    public Author updateAuthor(int id, AuthorCreateDTO dto) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        author.setFirstName(dto.getFirstName());
        author.setLastName(dto.getLastName());
        if (!authorRepository.existsById(id)) {
            throw new RuntimeException("Author not found");
        }
        return authorRepository.save(author);
    }

    @Override
    public void deleteAuthor(int id) {
        if (!authorRepository.existsById(id)) {
            throw new RuntimeException("Book with id " + id + " not found");
        }
        authorRepository.deleteById(id);
    }

}
