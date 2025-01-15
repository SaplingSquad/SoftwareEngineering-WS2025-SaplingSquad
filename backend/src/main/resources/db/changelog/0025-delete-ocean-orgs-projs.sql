--liquibase formatted sql
--changeset 0025:1
delete
from organization
    using regions
where org_id < 2000000
  and regions.region_id = id_of_nearest_region(organization.coordinates_lon, organization.coordinates_lat)
  and random() < 0.95
  and regions.continent_id = 'ocean';

--changeset 0025:2
delete
from project
    using regions
where project_id < 2000000
  and regions.region_id = id_of_nearest_region(project.coordinates_lon, project.coordinates_lat)
  and random() < 0.95
  and regions.continent_id = 'ocean';

/* fill caches with current values */
--changeset 0025:3
insert into organization_region_cache (org_id, region_id)
select org.org_id, id_of_nearest_region(coordinates_lon, coordinates_lat) as region_id
from organization as org
where org_id < 2000000;

--changeset 0020:4
insert into project_region_cache (project_id, region_id)
select project.project_id, id_of_nearest_region(coordinates_lon, coordinates_lat) as region_id
from project
where project_id < 2000000;