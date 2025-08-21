
package com.examly.springapp.exception;
import jakarta.validation.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.examly.springapp.model.Workout;

import java.time.LocalDate;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class WorkoutValidationTest {

    private Validator validator;

    @BeforeEach
    public void setUp() {
        // Get Validator instance
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void exception_testValidWorkout() {
        Workout workout = new Workout();
        workout.setType("Cardio");
        workout.setDuration(30);
        workout.setCaloriesBurned(200);
        workout.setDate(LocalDate.now());
        workout.setNotes("Good workout");

        Set<ConstraintViolation<Workout>> violations = validator.validate(workout);
        assertTrue(violations.isEmpty(), "Validation should pass for a valid workout");
    }

    @Test
    void exception_testInvalidType() {
        Workout workout = new Workout();
        workout.setType(""); // Invalid type, should trigger @NotBlank constraint
        workout.setDuration(30);
        workout.setCaloriesBurned(200);
        workout.setDate(LocalDate.now());

        Set<ConstraintViolation<Workout>> violations = validator.validate(workout);
        assertFalse(violations.isEmpty(), "Validation should fail due to empty type");
        assertEquals("Type must not be empty", violations.iterator().next().getMessage());
    }

    @Test
    void exception_testInvalidDuration() {
        Workout workout = new Workout();
        workout.setType("Strength");
        workout.setDuration(0); // Invalid duration, should trigger @Min(1) constraint
        workout.setCaloriesBurned(200);
        workout.setDate(LocalDate.now());

        Set<ConstraintViolation<Workout>> violations = validator.validate(workout);
        assertFalse(violations.isEmpty(), "Validation should fail due to invalid duration");
        assertEquals("Duration must be greater than 0", violations.iterator().next().getMessage());
    }

    @Test
    void exception_testInvalidCaloriesBurned() {
        Workout workout = new Workout();
        workout.setType("Cardio");
        workout.setDuration(30);
        workout.setCaloriesBurned(-1); // Invalid calories burned, should trigger @Min(0) constraint
        workout.setDate(LocalDate.now());

        Set<ConstraintViolation<Workout>> violations = validator.validate(workout);
        assertFalse(violations.isEmpty(), "Validation should fail due to negative calories burned");
        assertEquals("Calories burned must be greater than or equal to 0", violations.iterator().next().getMessage());
    }

    @Test
    void excetion_testInvalidDate() {
        Workout workout = new Workout();
        workout.setType("Yoga");
        workout.setDuration(30);
        workout.setCaloriesBurned(200);
        workout.setDate(null); // Invalid date, should trigger @NotNull constraint

        Set<ConstraintViolation<Workout>> violations = validator.validate(workout);
        assertFalse(violations.isEmpty(), "Validation should fail due to null date");
        assertEquals("Date must not be null", violations.iterator().next().getMessage());
    }
}
