package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.model.UserPlanProgress;
import com.examly.springapp.service.AssignmentService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<UserPlanProgress> assignPlan(@RequestBody Map<String, Integer> payload, HttpSession session) {
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        int planId = payload.get("planId");
        int memberId = payload.get("memberId");
        UserPlanProgress assignment = assignmentService.assignPlanToMember(planId, memberId);
        return ResponseEntity.ok(assignment);
    }

    @PutMapping("/{progressId}")
    public ResponseEntity<UserPlanProgress> updateProgress(@PathVariable int progressId, @RequestBody Map<String, Integer> payload, HttpSession session) {
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        int percentage = payload.get("completionPercentage");
        UserPlanProgress updatedProgress = assignmentService.updateProgress(progressId, percentage);
        return ResponseEntity.ok(updatedProgress);
    }

    @PutMapping("/{progressId}/status")
    public ResponseEntity<UserPlanProgress> updateProgressStatus(@PathVariable int progressId, @RequestBody Map<String, String> payload, HttpSession session) {
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String status = payload.get("status");
        UserPlanProgress updatedProgress = assignmentService.updateStatus(progressId, status);
        return ResponseEntity.ok(updatedProgress);
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<UserPlanProgress>> getAssignmentsForMember(@PathVariable int memberId, HttpSession session) {
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        List<UserPlanProgress> assignments = assignmentService.getAssignedPlansForMember(memberId);
        return ResponseEntity.ok(assignments);
    }

    @DeleteMapping("/{progressId}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable int progressId, HttpSession session) {
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        assignmentService.deleteAssignment(progressId);
        return ResponseEntity.noContent().build();
    }
}