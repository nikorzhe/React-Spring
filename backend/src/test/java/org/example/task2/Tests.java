package org.example.task2;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class Tests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void createBook() throws Exception {
        String json = """
        {
            "title": "Захар Беркут",
            "genre": "Історична повість",
            "yearPublished": 1883,
            "authorId": 1
        }
        """;

        mockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated());
    }

    @Test
    void getBookList() throws Exception {
        String request = "{\"page\":0,\"size\":5}";

        mockMvc.perform(post("/api/books/_list")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.list").isArray())
                .andExpect(jsonPath("$.totalPages").isNumber());
    }

    @Test
    void uploadJsonFile() throws Exception {
        String jsonContent = """
            [
                {"title":"Кобзар","genre":"Поезія","yearPublished":1840,"authorId":1},
                {"title":"Лісова пісня","genre":"Драма","yearPublished":1911,"authorId":3}
            ]
            """;

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "books.json",
                "application/json",
                jsonContent.getBytes()
        );

        mockMvc.perform(multipart("/api/books/upload").file(file))
                .andExpect(status().isCreated())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("books uploaded")));
    }

    @Test
    void downloadReport_success() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/books/report"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, containsString("books.csv")))
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, containsString("octet-stream")))
                .andReturn();

        byte[] csvBytes = result.getResponse().getContentAsByteArray();
        String csvContent = new String(csvBytes, StandardCharsets.UTF_8);


        assertThat(csvContent)
                .contains("Кобзар")
                .contains("Шевченко")
                .contains("Лісова пісня")
                .contains("Леся Українка");
    }
}