package com.example.todo.service;

import com.example.todo.entity.Task;
import com.example.todo.repository.TaskRepository;
import com.example.todo.security.model.User;
import com.example.todo.security.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final AuthService authService;

    public List<Task> findAll() {
        Optional<User> userOptional = authService.getCurrentUser();

        return userOptional.map(taskRepository::findAllByUser)
                .orElse(Collections.emptyList());
    }

    public Optional<Task> getById(Long id) {
        return taskRepository.findById(id);
    }

    public Task save(Task task) {
        User user = authService.getCurrentUser()
                .orElseThrow(() -> new IllegalStateException("No user found"));

        task.setUser(user);
        return taskRepository.save(task);
    }

    public Optional<Task> update(Task newTask) {
        return taskRepository.findById(newTask.getId())
                .map(task -> {
                    task.setDescription(newTask.getDescription());
                    task.setCompleted(newTask.isCompleted());
                    task.setUser(task.getUser());
                    return taskRepository.save(task);
                });
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }

}
