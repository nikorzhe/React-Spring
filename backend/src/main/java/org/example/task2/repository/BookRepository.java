package org.example.task2.repository;

import org.example.task2.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    Page<Book> findByGenreContainingIgnoreCaseAndAuthor_IdAndYearPublished(
            String genre,
            Integer authorId,
            Integer yearPublished,
            Pageable pageable
    );
}
