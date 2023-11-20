--liquibase formatted sql
--changeset example:inset-roles-01
INSERT INTO roles(id, name) VALUES(1, 'ROLE_ADMIN');
INSERT INTO roles(id, name) VALUES(2, 'ROLE_USER');
