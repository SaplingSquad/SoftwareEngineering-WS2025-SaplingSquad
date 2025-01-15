--liquibase formatted sql
--changeset 0023:1
alter table organization_bookmarks
    drop constraint organization_bookmarks_org_id_fkey;

--changeset 0023:2
alter table organization_bookmarks
    add constraint organization_bookmarks_org_id_fkey
        foreign key (org_id) references organization on delete cascade;

--changeset 0023:3
alter table project_bookmarks
    drop constraint project_bookmarks_project_id_fkey;

--changeset 0023:4
alter table project_bookmarks
    add constraint project_bookmarks_project_id_fkey
        foreign key (project_id) references project on delete cascade;

/* in 0015 we set the autoincrement start to 2000000 (i.e. for user-created orgas)*/
--changeset 0023:5
delete
from organization
where org_id < 2000000;

--changeset 0023:6
delete
from project
where project_id < 2000000;
