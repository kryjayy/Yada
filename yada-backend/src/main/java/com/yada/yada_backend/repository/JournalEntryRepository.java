package com.yada.yada_backend.repository;

import com.yada.yada_backend.entity.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
    List<JournalEntry> findByUserIdOrderByCreatedAtDesc(Long userId);
}