--liquibase formatted sql

--changeset 0017:1
create table project_bookmarks
(
    account_id text not null, /* OpenId Connect subject */
    project_id integer references project unique,
    primary key (account_id, project_id)
);

--changeset 0017:2
create table organization_bookmarks
(
    account_id text not null, /* OpenId Connect subject */
    org_id integer references organization unique,
    primary key (account_id, org_id)
);
