package org.example.task2.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.task2.Dto.*;
import org.example.task2.entity.Author;
import org.example.task2.entity.Book;
import org.example.task2.repository.AuthorRepository;
import org.example.task2.repository.BookRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    private final AuthorRepository authorRepository;

    private final ObjectMapper objectMapper;

    @Override
    public Book createBook(BookCreateDTO dto) {
        if (dto.getAuthorId() == null) {
            throw new RuntimeException("authorId is required");
        }

        Author author = authorRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author with id " + dto.getAuthorId() + " not found"));

        Book book = new Book();
        book.setTitle(dto.getTitle());
        book.setGenre(dto.getGenre());
        book.setYearPublished(dto.getYearPublished());
        book.setAuthor(author);

        return bookRepository.save(book);
    }

    @Override
    public Book getBookById(int id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
    }



    @Override
    public List<Book> getBooks() {

        return bookRepository.findAll();
    }

    @Override
    public Book updateBook(int id, BookCreateDTO dto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        book.setTitle(dto.getTitle());
        book.setGenre(dto.getGenre());
        book.setYearPublished(dto.getYearPublished());
        if (dto.getAuthorId() != null) {
            Author author = authorRepository.findById(dto.getAuthorId().intValue())
                    .orElseThrow(() -> new RuntimeException("Author not found"));
            book.setAuthor(author);
        }

        return bookRepository.save(book);
    }

    @Override
    public void deleteBook(int id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book with id " + id + " not found");
        }
        bookRepository.deleteById(id);

    }

    @Override
    public int uploadJson(MultipartFile file) {
        try {
            List<BookUploadDTO> uploadList = objectMapper.readValue(
                    file.getBytes(),
                    new TypeReference<List<BookUploadDTO>>() {}
            );

            List<Book> books = uploadList.stream()
                    .map(this::convertFromUpload)
                    .toList();

            List<Book> saved = bookRepository.saveAll(books);
            return saved.size();

        } catch (IOException e) {
            throw new RuntimeException("Failed to parse JSON file", e);
        }
    }


    private Book convertFromUpload(BookUploadDTO uploadDto) {
        Author author = authorRepository.findById(uploadDto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found: " + uploadDto.getAuthorId()));
        Book data = new Book();
        data.setTitle(uploadDto.getTitle());
        data.setGenre(uploadDto.getGenre());
        data.setAuthor(author);
        data.setYearPublished(uploadDto.getYearPublished());
        return data;
    }

    @Override
    public void generateReport(HttpServletResponse response) {
        response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=books.csv");
        try {
            StringBuilder sb = new StringBuilder();
            List<Book> books = bookRepository.findAll();
            for (Book book : books) {
                sb.append(book.getTitle())
                        .append(" ")
                        .append(book.getGenre())
                        .append("\n")
                        .append(book.getYearPublished())
                        .append("\n")
                        .append(book.getAuthor().getFirstName() + " " + book.getAuthor().getLastName())
                        .append("\n");
            }
            response.getOutputStream().write(sb.toString().getBytes());
            response.getOutputStream().flush();
        } catch (IOException e) {
            throw new RuntimeException("Error generating text file", e);
        }
    }

//    public List<Book> booksByGenre(String genre, Pageable paging) {
//        Page<Book> page = genre == null
//                ? bookRepository.findAll(paging)
//                : bookRepository.findByGenreContaining(genre, paging);
//
//        return page.getContent();
//    }

    @Override
    public BookListResponse getBookListPage(BookListRequest request) {
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());

        Page<Book> page = bookRepository.findByGenreContainingIgnoreCaseAndAuthor_IdAndYearPublished(
                request.getGenre(),
                request.getAuthorId(),
                request.getYearPublished(),
                pageable
        );

        List<BookListItem> list = page.getContent().stream()
                .map(book -> BookListItem.builder()
                        .id(book.getId().longValue())
                        .title(book.getTitle())
                        .genre(book.getGenre())
                        .yearPublished(book.getYearPublished())
                        .authorName(book.getAuthor().getFirstName() + " " + book.getAuthor().getLastName())
                        .build())
                .toList();

        return new BookListResponse(
                list,
                page.getTotalPages(),
                page.getTotalElements(),
                page.getNumber(),
                page.getSize()
        );
    }
//    @Override
//    public Page<BookListItem> getBookListPage(BookListRequest request) {
//        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());
//        Page<Book> page = bookRepository.findAll(pageable);
//
//        return page.map(book -> BookListItem.builder()
//                .id(book.getId())
//                .title(book.getTitle())
//                .genre(book.getGenre())
//                .yearPublished(book.getYearPublished())
//                .authorName(book.getAuthor().getFirstName() + " " + book.getAuthor().getLastName())
//                .build());
//    }
}
