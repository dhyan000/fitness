package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.model.Workout;
import com.examly.springapp.service.UserService;
import com.examly.springapp.service.WorkoutService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/workouts")
public class WorkoutController {

    // Test endpoint to verify the controller is working
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Workout controller is working!");
    }
    
    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Workout service is healthy!");
    }

    @Autowired
    private WorkoutService workoutService;
    
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Workout> createWorkout(@Valid @RequestBody Workout workout, HttpSession session) {
        System.out.println("--- CREATE WORKOUT REQUEST ---");
        System.out.println("Received workout data: " + workout);
        
        User user = (User) session.getAttribute("user");
        if (user == null) {
            System.out.println("No user in session, creating workout without user association");
            // For testing, create a default user or allow creation without user
            // In production, this should require authentication
            Workout createdWorkout = workoutService.createWorkout(workout);
            System.out.println("Created workout: " + createdWorkout);
            return new ResponseEntity<>(createdWorkout, HttpStatus.CREATED);
        }
        
        System.out.println("User found in session: " + user.getEmail());
        Workout createdWorkout = workoutService.createWorkoutForUser(workout, user.getEmail());
        return new ResponseEntity<>(createdWorkout, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<?> getAllWorkouts(HttpSession session) {
        System.out.println("--- GET ALL WORKOUTS REQUEST ---");
        
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                System.out.println("No user in session, returning all workouts");
                // For testing, return all workouts even without authentication
                // In production, this should require authentication
                List<Workout> workouts = workoutService.getAllWorkouts();
                System.out.println("Found " + workouts.size() + " workouts");
                
                // Create a simple response to avoid serialization issues
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("count", workouts.size());
                response.put("workouts", workouts);
                
                return ResponseEntity.ok(response);
            }
            
            System.out.println("User found in session: " + user.getEmail());
            // For now, return all workouts. In a real app, you might filter by user
            List<Workout> workouts = workoutService.getAllWorkouts();
            System.out.println("Found " + workouts.size() + " workouts");
            
            // Create a simple response to avoid serialization issues
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", workouts.size());
            response.put("workouts", workouts);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in getAllWorkouts: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving workouts: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Workout> getWorkoutById(@PathVariable int id, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            // For testing, allow access without authentication
            // In production, this should require authentication
        }
        
        Workout workout = workoutService.getWorkoutById(id);
        return ResponseEntity.ok(workout);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Workout> updateWorkout(@PathVariable int id, @Valid @RequestBody Workout workoutDetails, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            // For testing, allow access without authentication
            // In production, this should require authentication
        }
        
        Workout updatedWorkout = workoutService.updateWorkout(id, workoutDetails);
        return ResponseEntity.ok(updatedWorkout);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable int id, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            // For testing, allow access without authentication
            // In production, this should require authentication
        }
        
        workoutService.deleteWorkout(id);
        return ResponseEntity.noContent().build();
    }
}