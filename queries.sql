CREATE DATABASE testdb;

CREATE TABLE todo_list
(
    id SERIAL PRIMARY KEY,
    checkbox BOOLEAN,
    task TEXT,
    parent_id INTEGER
);

