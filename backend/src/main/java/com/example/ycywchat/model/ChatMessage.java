package com.example.ycywchat.model;

import java.time.LocalDateTime;

public record ChatMessage(
    String sender,
    String content,
    MessageType type,
    LocalDateTime timestamp
) {
    public ChatMessage {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
    
    public ChatMessage(String sender, String content, MessageType type) {
        this(sender, content, type, LocalDateTime.now());
    }
    
    public ChatMessage() {
        this(null, null, null, LocalDateTime.now());
    }

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }
}
