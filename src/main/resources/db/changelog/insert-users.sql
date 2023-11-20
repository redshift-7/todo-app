--liquibase formatted sql
--changeset example:inset-users-01
INSERT INTO users (id, username, email, password_hash)
VALUES  (1, 'Admin', 'admin@example.com', crypt('AdminPassword', gen_salt('bf'))),
        (2, 'John', 'john@example.com', crypt('JohnPassword', gen_salt('bf'))),
        (3, 'Alice', 'alice@example.com', crypt('AlicePassword', gen_salt('bf')));

ALTER SEQUENCE users_id_seq RESTART WITH 42;

SELECT setval('users_id_seq', (SELECT max(id) FROM users));