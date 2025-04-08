package com.example.ycywchat.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private String sender;
    private String content;
    private MessageType type;
    private LocalDateTime timestamp = LocalDateTime.now();

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }
}
