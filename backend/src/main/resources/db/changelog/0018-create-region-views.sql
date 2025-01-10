create function country_continent_id(continent text) returns text
return case
           when continent = 'Asia' then 'asia'
           when continent = 'South America' then 'southamerica'
           when continent = 'North America' then 'northamerica'
           when continent = 'Oceania' then 'oceania'
           when continent = 'Antarctica' then 'antarctica'
           when continent = 'Africa' then 'africa'
           when continent = 'Europe' then 'europe'
    -- explicitly assign islands with a Seven seas continent attribute to 'other' instead of ocean
    -- when continent = 'Seven seas (open ocean)' then 'ocean'
           else 'other' end;

create function country_continent_translation(continent text) returns text
return case
           when continent = 'Asia' then 'Asien'
           when continent = 'South America' then 'Südamerika'
           when continent = 'North America' then 'Nordamerika'
           when continent = 'Oceania' then 'Ozeanien'
           when continent = 'Antarctica' then 'Antarktik'
           when continent = 'Africa' then 'Afrika'
           when continent = 'Europe' then 'Europa'
    -- explicitly assign islands with a Seven seas continent attribute to 'Sonstige' instead of ocean
    -- when continent = 'Seven seas (open ocean)' then 'ocean'
           else 'Sonstige' end;

create function ocean_translation(marine_region ne_50m_geography_marine_polys) returns text
return case
    -- custom translations
           when marine_region.name = 'North Pacific Ocean' then 'Nordpazifischer Ozean'
           when marine_region.name = 'South Pacific Ocean' then 'Südpazifischer Ozean'
           else marine_region.name_de end;

create materialized view regions as
with countries as (select adm0_a3_de                               as id,
                          name_de                                  as name,
                          country_continent_id(continent)          as continent_id,
                          country_continent_translation(continent) as continent,
                          geom
                   from ne_50m_admin_0_countries
                   where fclass_de is distinct from 'Unrecognized'),
     marine_regions as (select concat('mar-', gid)                              as id,
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

create materialized view region_continents as
select distinct continent_id, continent
from regions;

