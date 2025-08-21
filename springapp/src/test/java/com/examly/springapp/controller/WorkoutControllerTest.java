package com.examly.springapp.controller;

import com.examly.springapp.model.Workout;
import com.examly.springapp.repository.WorkoutRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.time.LocalDate;
import java.util.Arrays;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class WorkoutControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WorkoutRepository workoutRepository;

    @BeforeEach
    void setUp() {
        workoutRepository.deleteAll();
    }

    @Test
    void controller_testGetAllWorkouts() throws Exception {
        Workout w1 = new Workout();
        w1.setType("Running"); w1.setDuration(30); w1.setCaloriesBurned(300); w1.setDate(LocalDate.of(2023,5,15));
        w1.setNotes("Morning run");
        Workout w2 = new Workout();
        w2.setType("Cycling"); w2.setDuration(45); w2.setCaloriesBurned(450); w2.setDate(LocalDate.of(2023,5,20));
        w2.setNotes("Evening ride");
        Workout w3 = new Workout();
        w3.setType("Swimming"); w3.setDuration(60); w3.setCaloriesBurned(500); w3.setDate(LocalDate.of(2023,5,21));
        w3.setNotes("Pool laps");
        workoutRepository.saveAll(Arrays.asList(w1, w2, w3));

        mockMvc.perform(get("/api/workouts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].type", is("Running")));
    }

    @Test
    void controller_testGetWorkoutById() throws Exception {
        Workout w = new Workout();
        w.setType("Running"); w.setDuration(30); w.setCaloriesBurned(300); w.setDate(LocalDate.of(2023,5,15));
        w.setNotes("Morning run");
        w = workoutRepository.save(w);

        mockMvc.perform(get("/api/workouts/{id}", w.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type", is("Running")))
                .andExpect(jsonPath("$.duration", is(30)))
                .andExpect(jsonPath("$.caloriesBurned", is(300)))
                .andExpect(jsonPath("$.date", is("2023-05-15")))
                .andExpect(jsonPath("$.notes", is("Morning run")));
    }

    @Test
    void controller_testGetWorkoutByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/workouts/{id}", 9999))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", is("Workout not found with id: 9999")));
    }

    @Test
    void controller_testCreateWorkout() throws Exception {
        String json = "{" +
            "\"type\":\"Running\"," +
            "\"duration\":30," +
            "\"caloriesBurned\":300," +
            "\"date\":\"2023-05-15\"," +
            "\"notes\":\"Test workout\"}";
        ResultActions result = mockMvc.perform(post("/api/workouts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json));
        result.andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.type", is("Running")))
                .andExpect(jsonPath("$.duration", is(30)))
                .andExpect(jsonPath("$.caloriesBurned", is(300)))
                .andExpect(jsonPath("$.date", is("2023-05-15")))
                .andExpect(jsonPath("$.notes", is("Test workout")));
    }

    @Test
    void controller_testCreateWorkoutValidation() throws Exception {
        LocalDate futureDate = LocalDate.now().plusDays(3);
        String json = "{" +
            "\"type\":\"\"," +
            "\"duration\":0," +
            "\"caloriesBurned\":-100," +
            "\"date\":\""+futureDate+"\"," +
            "\"notes\":\"Invalid\"}";
        ResultActions result = mockMvc.perform(post("/api/workouts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json));
        result.andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", anyOf(is("Validation failed"), is("Date must not be a future date"))))
                .andExpect(jsonPath("$.errors.type", is("Type must not be empty")))
                .andExpect(jsonPath("$.errors.duration", is("Duration must be greater than 0")))
                .andExpect(jsonPath("$.errors.caloriesBurned", is("Calories burned must be greater than or equal to 0")));
    }
}
