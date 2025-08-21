package com.examly.springapp.exception;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class GlobalExceptionHandlerTest {

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        // Create a test controller that throws exceptions
        TestController testController = new TestController();
        GlobalExceptionHandler globalExceptionHandler = new GlobalExceptionHandler();
        
        mockMvc = MockMvcBuilders.standaloneSetup(testController)
                .setControllerAdvice(globalExceptionHandler)
                .build();
    }

    @Test
    void exception_testHandleMethodNotAllowed() throws Exception {
        // Try to POST to a GET-only endpoint
        mockMvc.perform(post("/test/runtime-exception"))
                .andExpect(status().isMethodNotAllowed());
    }

    @Test
    void exception_testHandleNotFound() throws Exception {
        // Try to access a non-existent endpoint
        mockMvc.perform(get("/test/non-existent"))
                .andExpect(status().isNotFound());
    }

    // Test controller that throws various exceptions
    @RestController
    @RequestMapping("/test")
    static class TestController {

        @GetMapping("/runtime-exception")
        public String throwRuntimeException() {
            throw new RuntimeException("Test runtime exception");
        }

        @GetMapping("/illegal-argument")
        public String throwIllegalArgumentException() {
            throw new IllegalArgumentException("Test illegal argument");
        }

        @PostMapping("/create")
        public String create(@RequestBody String body) {
            if (body == null || body.trim().isEmpty()) {
                throw new IllegalArgumentException("Body cannot be empty");
            }
            return "created";
        }
    }
}