--liquibase formatted sql
create function name_of_nearest_region(lon float4, lat float4)
    returns text
    language sql
as
$$
with distances as
         (select *, st_distance(st_point(lon, lat, 4326), regions.geom) as distance
          from regions)
select name
from distances
order by distance
limit 1;
$$;

alter table organization
    add column region_name text generated always as ( name_of_nearest_region(coordinates_lon, coordinates_lat) ) stored;

alter table project
    add column region_name text generated always as ( name_of_nearest_region(coordinates_lon, coordinates_lat) ) stored;
