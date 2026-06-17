package com.yada.yada_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "rhema_prompts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RhemaPrompt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mood_tag")
    private String moodTag;

    @Column(name = "faith_tier")
    private String faithTier;

    private String scripture;

    @Column(name = "scripture_text", columnDefinition = "TEXT")
    private String scriptureText;

    @Column(name = "reflection_prompt", columnDefinition = "TEXT")
    private String reflectionPrompt;
}
