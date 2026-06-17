package com.yada.yada_backend.repository;

import com.yada.yada_backend.entity.CheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    List<CheckIn> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<CheckIn> findTop7ByUserIdOrderByCreatedAtDesc(Long userId);
}