package com.yada.yada_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "check_ins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "answers_json", columnDefinition = "TEXT")
    private String answersJson;

    @Column(name = "mood_label")
    private String moodLabel;

    @Column(columnDefinition = "TEXT")
    private String reflection;

    @Column(name = "rhema_prompt", columnDefinition = "TEXT")
    private String rhemaPrompt;

    @Column(name = "prayer_point", columnDefinition = "TEXT")
    private String prayerPoint;

    @Column(name = "crisis_mode")
    private boolean crisisMode;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}