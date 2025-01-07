--liquibase formatted sql
--changeset 0015:1
alter table organization
    alter column org_id restart with 2000000;

--changeset 0015:2
alter table project
    alter column project_id restart with 2000000;
