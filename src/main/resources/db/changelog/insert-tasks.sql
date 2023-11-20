-- liquibase formatted sql
-- changeset example:insert-tasks-01
INSERT INTO tasks (description, completed, user_id)
VALUES ('Plan a surprise birthday party for a friend', false, 2),
       ('Take a leisurely walk or engage in a physical activity you enjoy to boost your mood and overall well-being.', false, 2),
       ('Start a new fitness challenge', true, 2),
       ('Create a painting inspired by nature', false, 2),
       ('Organize a virtual game night with friends', true, 2),
       ('Read the first chapter of a new novel', true, 3),
       ('Experiment with a new recipe for dinner', false, 3),
       ('Research and explore one new tool or technology that could enhance efficiency or productivity in your work processes, ' ||
        'and assess its potential integration into your workflow.', false, 3);

ALTER SEQUENCE tasks_id_seq RESTART WITH 42;

SELECT setval('tasks_id_seq', (SELECT max(id) FROM tasks));
