package com.examly.springapp.service;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.User;
import com.examly.springapp.model.Workout;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkoutService {

    @Autowired
    private WorkoutRepository workoutRepository;
    
    @Autowired
    private UserRepository userRepository;

    public Workout createWorkoutForUser(Workout workout, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        workout.setUser(user);
        return workoutRepository.save(workout);
    }
    
    public Workout createWorkout(Workout workout) {
        // For testing purposes - create workout without user association
        // In production, this should always require a user
        return workoutRepository.save(workout);
    }
    
    public List<Workout> getAllWorkouts() {
        try {
            System.out.println("--- GETTING ALL WORKOUTS FROM DATABASE ---");
            List<Workout> workouts = workoutRepository.findAll();
            System.out.println("Successfully retrieved " + workouts.size() + " workouts from database");
            return workouts;
        } catch (Exception e) {
            System.err.println("Error retrieving workouts from database: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public Workout getWorkoutById(int id) {
        return workoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found with id: " + id));
    }

    public Workout updateWorkout(int id, Workout workoutDetails) {
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found with id: " + id));
        workout.setWorkoutName(workoutDetails.getWorkoutName());
        workout.setDuration(workoutDetails.getDuration());
        workout.setCaloriesBurned(workoutDetails.getCaloriesBurned());
        workout.setDate(workoutDetails.getDate());
        workout.setNotes(workoutDetails.getNotes());
        workout.setType(workoutDetails.getType());
        return workoutRepository.save(workout);
    }

    public void deleteWorkout(int id) {
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found with id: " + id));
        workoutRepository.delete(workout);
    }
}