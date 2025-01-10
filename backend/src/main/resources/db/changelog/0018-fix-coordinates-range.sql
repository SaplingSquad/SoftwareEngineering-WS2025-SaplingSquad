--liquibase formatted sql

/*
 Fix the coordinates of organizations and projects, if they are outside of lon [-180, 180] and lat [-90, 90]
 When traveling horizontally around the globe starting from lon 0, normalized longitudes
    increase continuously up to 180
    then jump at once from 180 back to -180,
    then increase continuously again until 180 for the next rotation
    and so on
 => For longitude, effectively add/subtract 360 until it is in the correct range.

 When traveling vertically around the globe, starting from lat 0 normalized latitudes
    increase continuously up to 90 at the north pole,
    then decrease continuously to -90 at the south pole,
    then increase again until 90
    and so on
=> For latitude, effectively add/subtract 180 until it is in the correct range.
    However, if one had to add 180 an odd number of times, one has landed on the opposite side of the globe (i.e.
    a different longitude when normalizing) and
    - has to add 180 to the longitude (before normalizing the longitude) and
    - has to invert the sign of the latitude: The opposite side of a latitude x isn't x + 180 as it is the case with
      longitudes, but 180 - x instead
     Example
        - lat 120 => 120-180 = -60 => invert: 60
          (120 degrees north from the equator is equivalent to 60 degrees north from the equator on the opposite side)
        - when increasing from 120 to lat 130 => 130-180 = -50 => invert: 50
          (130 degrees north from the equator is equivalent to just 50 degrees north from the equator on the opposite
          side)
        - lat 300 => 300-2*180 = -60 => dont invert: -60
          (300 degrees north from the equator is equivalent to 60 degrees south from the equator on the same side)
 */

/* create helper functions */
--changeset 0018:1
create function __floor_mod(x numeric, y numeric) returns numeric
return (((x % y) + y) % y);

--changeset 0018:2
create function __flip_side(lat numeric) returns integer
as
$$
/* 0 -> dont flip side, 1 -> flip side */
select floor(__floor_mod(lat + 90, 360) / 180)
$$
    language sql;


--changeset 0018:3
update organization
/* // if flip side, then add another 180 degrees to the coordinates
   lon = coordinates_lon + (180 * flip_side?)
   // normalizes to range [-180, 180]
   floor_mod(lon + 180, 360) - 180 */
set coordinates_lon = __floor_mod(
                              coordinates_lon::numeric + (180 * __flip_side(coordinates_lat::numeric)) /* lon */
                                  + 180,
                              360
                      ) - 180,
/* // normalizes to range [-90, 90], but mirrored if it crossed the poles
   floor_mod(lon + 90, 180) - 90
   // corrects the value if it crossed the poles
   -2 * flip_side? + 1 =  1 if flip_side == 0
                         -1 if flip_side == 1
   */
    coordinates_lat = (__floor_mod(coordinates_lat::numeric + 90, 180.0) - 90) *
                      (-2 * __flip_side(coordinates_lat::numeric) + 1) /* 0 -> do nothing, 1 -> invert sign, handles going over the poles */
where true;

--changeset 0018:4
update project
set coordinates_lon = __floor_mod(
                              coordinates_lon::numeric + (180 * __flip_side(coordinates_lat::numeric)) /* lon */
                                  + 180,
                              360
                      ) - 180,
    coordinates_lat = (__floor_mod(coordinates_lat::numeric + 90, 180.0) - 90) *
                      (-2 * __flip_side(coordinates_lat::numeric) + 1) /* 0 -> do nothing, 1 -> invert sign, handles going over the poles */
where true;

--changeset 0018:5
drop function __flip_side;
--changeset 0018:6
drop function __floor_mod;
