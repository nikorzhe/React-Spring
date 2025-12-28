package org.example.task2.services;

import org.example.task2.Dto.AuthorCreateDTO;
import org.example.task2.entity.Author;
import org.springframework.stereotype.Service;

@Service
public interface AuthorService {

    Author createAuthor(AuthorCreateDTO authorCreateDTO);

    Author getAuthorById(int id);

    Author updateAuthor(int id, AuthorCreateDTO authorDetailsDTOUpdateDTO);

    void deleteAuthor(int id);

}
