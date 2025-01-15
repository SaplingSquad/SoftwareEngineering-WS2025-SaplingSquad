--liquibase formatted sql
--changeset 0021:1
alter table organization
    alter founding_year drop not null,
    alter website_url set not null;