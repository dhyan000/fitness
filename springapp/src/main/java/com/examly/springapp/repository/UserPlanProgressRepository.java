package com.examly.springapp.repository;import com.examly.springapp.model.UserPlanProgress;import org.springframework.data.jpa.repository.JpaRepository;import org.springframework.stereotype.Repository;import java.util.List;
@Repository
public interface UserPlanProgressRepository extends JpaRepository<UserPlanProgress, Integer> {        
    /**     * This custom method finds all progress records for a specific user.     * It's required by the AssignmentService to get a member's assigned plans.     */    
List<UserPlanProgress> findByUserId(int userId);
} 