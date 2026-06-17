package com.yada.yada_backend.controller;

import com.yada.yada_backend.entity.CheckIn;
import com.yada.yada_backend.entity.User;
import com.yada.yada_backend.repository.CheckInRepository;
import com.yada.yada_backend.service.AuthService;
import com.yada.yada_backend.service.ClaudeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/checkin")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInRepository checkInRepository;
    private final AuthService authService;
    private final ClaudeService claudeService;

    @PostMapping
    public ResponseEntity<?> submitCheckIn(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            User user = authService.getCurrentUser(authentication.getName());

            String answersJson = request.get("answersJson");
            String moodLabel = request.get("moodLabel");

            String reflection = claudeService.generateReflection(answersJson, moodLabel);

            CheckIn checkIn = new CheckIn();
            checkIn.setUser(user);
            checkIn.setAnswersJson(answersJson);
            checkIn.setMoodLabel(moodLabel);
            checkIn.setReflection(reflection);
            checkIn.setCrisisMode(false);

            checkInRepository.save(checkIn);

            return ResponseEntity.ok(Map.of(
                "reflection", reflection,
                "checkInId", checkIn.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getCheckIns(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<CheckIn> checkIns = checkInRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(checkIns);
    }
}
