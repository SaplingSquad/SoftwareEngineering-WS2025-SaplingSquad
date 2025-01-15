--liquibase formatted sql
--changeset 0022:1
create table user_answer
(
    account_id  text    not null,
    question_id integer not null references question on delete cascade,
    primary key (account_id, question_id)
);