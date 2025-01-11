--liquibase formatted sql
--changeset 0020:1
create function name_of_nearest_region(lon float4, lat float4)
    returns text
    language sql
    stable
as
$$
with distances as
         (select *, st_distance(st_point(lon, lat, 4326), regions.geom) as distance
          from regions)
select name
from distances
order by distance
limit 1
$$;

--changeset 0020:2
create table organization_region_cache
(
    org_id      integer primary key references organization on delete cascade,
    region_name text
);

--changeset 0020:3
create table project_region_cache
(
    project_id  integer primary key references project on delete cascade,
    region_name text
);

--changeset 0020:4
create procedure recalculate_region_of_organization(org_id integer)
    language sql
as
$$
insert into organization_region_cache (org_id, region_name)
select org.org_id, name_of_nearest_region(coordinates_lon, coordinates_lat) as region_name
from organization as org
where org.org_id = recalculate_region_of_organization.org_id
on conflict (org_id)
    do update set region_name = EXCLUDED.region_name
$$;

--changeset 0020:5
create procedure recalculate_region_of_project(project_id integer)
    language sql
as
$$
insert into project_region_cache (project_id, region_name)
select project.project_id, name_of_nearest_region(coordinates_lon, coordinates_lat) as region_name
from project
where project.project_id = recalculate_region_of_project.project_id
on conflict (project_id)
    do update set region_name = EXCLUDED.region_name
$$;

/* fill caches with current values */
--changeset 0020:6
insert into organization_region_cache (org_id, region_name)
select org.org_id, name_of_nearest_region(coordinates_lon, coordinates_lat) as region_name
from organization as org;

--changeset 0020:7
insert into project_region_cache (project_id, region_name)
select project.project_id, name_of_nearest_region(coordinates_lon, coordinates_lat) as region_name
from project;

/* create views for organization/projects + region_name column */
--changeset 0020:8
create view organization_with_region_name
as
select organization.*, orc.region_name
from organization
         left join organization_region_cache as orc using (org_id);

--changeset 0020:9
create view project_with_region_name
as
select project.*, prc.region_name
from project
         left join project_region_cache as prc using (project_id);
