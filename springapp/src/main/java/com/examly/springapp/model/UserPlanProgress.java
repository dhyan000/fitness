package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "user_plan_progress")
public class UserPlanProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int progressId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // FIXED: This now links to a Workout instead of a WorkoutPlan
    @ManyToOne
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;

    private LocalDate assignedDate;
    private int completionPercentage;
    private LocalDate lastUpdated;
    
    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status { ACTIVE, COMPLETED, PAUSED }
    
    // --- Getters and Setters ---

    public int getProgressId() { return progressId; }
    public void setProgressId(int progressId) { this.progressId = progressId; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Workout getWorkout() { return workout; } // Getter updated
    public void setWorkout(Workout workout) { this.workout = workout; } // Setter updated
    public LocalDate getAssignedDate() { return assignedDate; }
    public void setAssignedDate(LocalDate assignedDate) { this.assignedDate = assignedDate; }
    public int getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(int completionPercentage) { this.completionPercentage = completionPercentage; }
    public LocalDate getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDate lastUpdated) { this.lastUpdated = lastUpdated; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}