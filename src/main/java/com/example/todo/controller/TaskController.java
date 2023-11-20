package com.example.todo.controller;

import com.example.todo.entity.Task;
import com.example.todo.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@CrossOrigin
@RestController
@RequestMapping("/api")
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/tasks")
    public List<Task> all() {
        log.info("Request to get all tasks for current user");

        return taskService.findAll();
    }

    @GetMapping("/task/{id}")
    public ResponseEntity<Task> one(@PathVariable Long id) {
        log.info("Request to get tasks with id: {}", id);

        return taskService.getById(id).map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/tasks")
    public ResponseEntity<Task> newTask(@Valid @RequestBody Task task) throws URISyntaxException {
        log.info("Request to save new task item: {}", task);
        Task result = taskService.save(task);
        log.info("New task saved with id: {}", result.getId());

        return ResponseEntity.created(new URI("/api/task/" + result.getId())).body(result);
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<Task> updateTask(@Valid @RequestBody Task newTask, @PathVariable Long id) {
        log.info("Request to update task with id: {}", id);
        Optional<Task> result = taskService.update(newTask);

        return result.map(task -> ResponseEntity.ok().body(task))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<HttpStatus> deleteTask(@PathVariable Long id) {
        log.info("Request to delete task with id: {}", id);
        taskService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
