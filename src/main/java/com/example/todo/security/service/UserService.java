package com.example.todo.security.service;

import com.example.todo.repository.RoleRepository;
import com.example.todo.repository.UserRepository;
import com.example.todo.security.model.RoleName;
import com.example.todo.security.model.Role;
import com.example.todo.security.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class UserService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    public void createNewUserAccount(User user, Set<String> requestedRoles) {
        Set<Role> roles = new HashSet<>();

        if (requestedRoles == null || requestedRoles.isEmpty()) {
            roles.add(getRoleByName(RoleName.ROLE_USER));
        } else {
            requestedRoles.forEach(role -> addRole(roles, role));
        }

        user.setRoles(roles);
        userRepository.save(user);
    }

    private void addRole(Set<Role> roles, String roleName) {
        roleRepository.findByName(RoleName.valueOf(roleName.toUpperCase()))
                .ifPresent(roles::add);

        if (roles.isEmpty()) {
            throw new RuntimeException("Error: Role is not found.");
        }
    }

    private Role getRoleByName(RoleName roleName) {
        return roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
    }
}
