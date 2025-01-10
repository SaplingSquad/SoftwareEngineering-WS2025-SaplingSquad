--liquibase formatted sql
--changeset 0019:1
create function country_continent_id(continent text) returns text
return case
           when continent = 'Asia' then 'asia'
           when continent = 'South America' then 'southamerica'
           when continent = 'North America' then 'northamerica'
           when continent = 'Oceania' then 'oceania'
           when continent = 'Antarctica' then 'antarctica'
           when continent = 'Africa' then 'africa'
           when continent = 'Europe' then 'europe'
    /*     when continent = 'Seven seas (open ocean)' then 'ocean' */
    /* assign islands with a 'Seven seas' continent attribute to group 'other' instead of 'ocean' */
           else 'other' end;

--changeset 0019:2
create function country_continent_translation(continent text) returns text
return case
           when continent = 'Asia' then 'Asien'
           when continent = 'South America' then 'Südamerika'
           when continent = 'North America' then 'Nordamerika'
           when continent = 'Oceania' then 'Ozeanien'
           when continent = 'Antarctica' then 'Antarktik'
           when continent = 'Africa' then 'Afrika'
           when continent = 'Europe' then 'Europa'
    /*     when continent = 'Seven seas (open ocean)' then 'Ozeane' */
    /* assign islands with a 'Seven seas' continent attribute to group 'Sonstige' instead of 'Ozeane' */
           else 'Sonstige' end;

--changeset 0019:3
create function ocean_translation(marine_region ne_50m_geography_marine_polys) returns text
return case
    /* custom translations */
           when marine_region.name = 'North Pacific Ocean' then 'Nordpazifischer Ozean'
           when marine_region.name = 'South Pacific Ocean' then 'Südpazifischer Ozean'
           else marine_region.name_de end;

--changeset 0019:4
create materialized view regions as
with countries as (select adm0_a3_de                               as region_id,
                          name_de                                  as name,
                          country_continent_id(continent)          as continent_id,
                          country_continent_translation(continent) as continent,
                          geom
                   from ne_50m_admin_0_countries
                   where fclass_de is distinct from 'Unrecognized'),
     marine_regions as (select concat('mar-', gid)                              as region_id,
                               ocean_translation(ne_50m_geography_marine_polys) as name,
                               'ocean'                                          as continent_id,
                               'Ozeane'                                         as continent,
                               geom
                        from ne_50m_geography_marine_polys
                        where featurecla = 'ocean')
select *
from countries
union
(select *
 from marine_regions);

--changeset 0019:5
create materialized view region_continents as
select distinct continent_id, continent
from regions;

