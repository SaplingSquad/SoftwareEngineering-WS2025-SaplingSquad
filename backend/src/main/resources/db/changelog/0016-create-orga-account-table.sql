--liquibase formatted sql

--changeset 0015:1
create table orga_account
(
    account_id text primary key, /* OpenId Connect subject */
    org_id    integer references organization unique,
    verified  boolean default false
)