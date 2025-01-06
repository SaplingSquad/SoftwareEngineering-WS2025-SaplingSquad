--liquibase formatted sql

/* Reverts changes in 0009 and 0008 */

--changeset 0010:revert-0008:5
drop table if exists region;
--changeset 0010:revert-0008:4
drop table if exists project_tags;
--changeset 0010:revert-0008:3
drop table if exists project;
--changeset 0010:revert-0008:2
drop table if exists organization_tags;
--changeset 0010:revert-0008:1
drop table if exists organization;
