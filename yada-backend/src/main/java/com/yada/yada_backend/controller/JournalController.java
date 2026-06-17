package com.yada.yada_backend.controller;

import com.yada.yada_backend.entity.JournalEntry;
import com.yada.yada_backend.entity.User;
import com.yada.yada_backend.repository.JournalEntryRepository;
import com.yada.yada_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
public class JournalController {

    private final JournalEntryRepository journalEntryRepository;
    private final AuthService authService;

    @PostMapping
    public ResponseEntity<?> createEntry(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            User user = authService.getCurrentUser(authentication.getName());

            JournalEntry entry = new JournalEntry();
            entry.setUser(user);
            entry.setContent(request.get("content"));
            entry.setPromptUsed(request.get("promptUsed"));
            if (request.get("linkedCheckinId") != null) {
                entry.setLinkedCheckinId(Long.parseLong(request.get("linkedCheckinId")));
            }

            journalEntryRepository.save(entry);
            return ResponseEntity.ok(entry);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getEntries(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<JournalEntry> entries = journalEntryRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(entries);
    }
}