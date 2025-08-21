package com.examly.springapp.service;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.User;
import com.examly.springapp.model.Workout; // FIXED: Import Workout instead of WorkoutPlan
import com.examly.springapp.model.UserPlanProgress;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.WorkoutRepository;
import com.examly.springapp.repository.UserPlanProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class AssignmentService {

    @Autowired
    private UserPlanProgressRepository progressRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WorkoutRepository workoutRepository; // FIXED: Use WorkoutRepository

    @Transactional
    public UserPlanProgress assignPlanToMember(int workoutId, int memberId) {
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + memberId));
        
        // FIXED: Use workoutRepository to find a Workout object
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found with id: " + workoutId));

        UserPlanProgress newAssignment = new UserPlanProgress();
        newAssignment.setUser(member);
        newAssignment.setWorkout(workout); // FIXED: Set the Workout object
        newAssignment.setAssignedDate(LocalDate.now());
        newAssignment.setLastUpdated(LocalDate.now());
        newAssignment.setCompletionPercentage(0);
        newAssignment.setStatus(UserPlanProgress.Status.ACTIVE);

        return progressRepository.save(newAssignment);
    }

    @Transactional
    public UserPlanProgress updateProgress(int progressId, int percentage) {
        // This method remains valid
        UserPlanProgress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress record not found with id: " + progressId));

        progress.setCompletionPercentage(percentage);
        progress.setLastUpdated(LocalDate.now());

        if (percentage >= 100) {
            progress.setStatus(UserPlanProgress.Status.COMPLETED);
        }

        return progressRepository.save(progress);
    }

    public List<UserPlanProgress> getAssignedPlansForMember(int memberId) {
        return progressRepository.findByUserId(memberId);
    }

    public void deleteAssignment(int progressId) {
        if (!progressRepository.existsById(progressId)) {
            throw new ResourceNotFoundException("Assignment not found with id: " + progressId);
        }
        progressRepository.deleteById(progressId);
    }

    @Transactional
    public UserPlanProgress updateStatus(int progressId, String status) {
        // This method remains valid
        UserPlanProgress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress record not found with id: " + progressId));

        switch (status.toLowerCase()) {
            case "completed":
                progress.setStatus(UserPlanProgress.Status.COMPLETED);
                progress.setCompletionPercentage(100);
                break;
            case "will complete":
                progress.setStatus(UserPlanProgress.Status.ACTIVE);
                break;
            case "skipped today":
                progress.setStatus(UserPlanProgress.Status.PAUSED);
                break;
            default:
                throw new IllegalArgumentException("Invalid status: " + status);
        }
        progress.setLastUpdated(LocalDate.now());
        return progressRepository.save(progress);
    }
}