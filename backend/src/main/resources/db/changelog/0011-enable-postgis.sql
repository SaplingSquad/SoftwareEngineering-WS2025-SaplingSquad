--liquibase formatted sql

/*
    Don't fail on error (if insufficient privileges),
    however an adminstrator has to enable postgis explicitly in this case
*/
--changeset 0011:1 failOnError:false
create extension if not exists postgis;

/*
Check if PostGIS enabled
 */
--changeset 0011:2 runAlways:true failOnError:true
select PostGIS_Full_Version();