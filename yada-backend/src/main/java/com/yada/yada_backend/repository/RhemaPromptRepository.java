package com.yada.yada_backend.repository;

import com.yada.yada_backend.entity.RhemaPrompt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RhemaPromptRepository extends JpaRepository<RhemaPrompt, Long> {
    List<RhemaPrompt> findByMoodTagAndFaithTier(String moodTag, String faithTier);
}