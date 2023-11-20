--liquibase formatted sql
--changeset example:inset-user-roles-01
INSERT INTO user_roles (user_id, role_id)
VALUES (1, 1),
       (2, 2),
       (3, 2);