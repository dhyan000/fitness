package com.examly.springapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "exercises") // Match the table name from the SRS
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int exerciseId;

    @NotBlank(message = "Exercise name must be 1-100 characters long")
    @Size(min = 1, max = 100, message = "Exercise name must be 1-100 characters long")
    private String name;

    @Size(max = 500)
    private String description;

    @Min(value = 1, message = "Sets must be a positive number (minimum 1)")
    private int sets;

    @Min(value = 1, message = "Repetitions must be a positive number (minimum 1)")
    private int reps;

    // Many Exercises can belong to one WorkoutPlan.
    // @JsonIgnore prevents a problem where the models would try to print each other forever.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    @JsonIgnore
    private WorkoutPlan workoutPlan;

    // --- Getters and Setters ---

    public int getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(int exerciseId) {
        this.exerciseId = exerciseId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getSets() {
        return sets;
    }

    public void setSets(int sets) {
        this.sets = sets;
    }

    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

    public WorkoutPlan getWorkoutPlan() {
        return workoutPlan;
    }

    public void setWorkoutPlan(WorkoutPlan workoutPlan) {
        this.workoutPlan = workoutPlan;
    }
}