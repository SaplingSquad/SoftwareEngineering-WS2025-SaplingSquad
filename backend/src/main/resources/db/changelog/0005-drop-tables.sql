--liquibase formatted sql
--changeset 0005:revert-0003:5
drop table if exists region;
--changeset 0005:revert-0003:4
drop table if exists project_tags;
--changeset 0005:revert-0003:3
drop table if exists project;
--changeset 0005:revert-0003:2
drop table if exists organization_tags;
--changeset 0005:revert-0003:1
drop table if exists organization;

--changeset 0005:revert-0001:2
drop table if exists question;
--changeset 0005:revert-0001:1
drop table if exists filter_tag;
