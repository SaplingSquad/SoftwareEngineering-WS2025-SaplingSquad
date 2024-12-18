--liquibase formatted sql
--changeset 0006:1
create table filter_tag
(
    tag_id integer primary key generated by default as identity,
    name   text not null
);

--changeset 0006:2
create table question
(
    question_id    integer primary key generated by default as identity,
    question       text not null,
    question_title text not null,
    image_url      text,
    tag_id         integer references filter_tag
);
