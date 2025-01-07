--liquibase formatted sql

--changeset 0017:1
create table project_bookmarks
(
    account_id text primary key, /* OpenId Connect subject */
    project_id integer references project unique
);

--changeset 0017:2
create table organization_bookmarks
(
    account_id text primary key, /* OpenId Connect subject */
    org_id integer references organization unique
);
