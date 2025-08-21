package com.examly.springapp.repository;

import com.examly.springapp.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Integer> {
    
    // We can add custom methods here if needed later, for example:
    // List<Exercise> findByWorkoutPlan_PlanId(int planId);
}