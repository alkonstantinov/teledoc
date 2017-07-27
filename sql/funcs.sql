--логин с парола

create or replace function Login (_Username citext, _Password citext) 
returns table (UserId int, Name varchar(100), LevelId int)
 as $$
  select u.UserId, u.Name, u.LevelId from "User" u where u.Username = _Username and u.Password = _Password and u.Active = true and IsFB = false;
$$ LANGUAGE sql; 


--логин през фейсбук
create or replace function Login (_Username citext) 
returns table (UserId int, Name varchar(100), LevelId int)
 as $$
  select u.UserId, u.Name, u.LevelId from "User" u where u.Username = _Username and u.Active = true and IsFB = true;
$$ LANGUAGE sql; 

--проверка за наличен имейл
create or replace function pLoginExists (_Username citext) 
returns table (UserId int)
 as $$
  select u.UserId from "User" u where u.Username = _Username
$$ LANGUAGE sql;  

--регистрация експерт
create or replace function pDoctorSet (_DoctorData json)
returns integer
 as $$
 declare _UserId integer;
begin
  if (_DoctorData->'UserId' is not null) then
    update "User"
    set
      LevelId = _DoctorData->>'LevelId',
      Name = _DoctorData->>'Name'
    where UserId = _DoctorData->'UserId';
  
  else
    insert into "User" 
    (LevelId, 
    UserName, 
    Password, 
    IsFB, 
    Name, 
    Active)
    values 
    (_DoctorData->>'LevelId',
    _DoctorData->>'UserName',
    _DoctorData->>'Password',
    _DoctorData->>'IsFB',
    _DoctorData->>'Name',
    _DoctorData->>'Active')
    returning UserId into _UserId;

    insert into Doctor
    (UserId,
    UIN,
    img,
    Specialization,
    Description
    )
    values
    (_UserId,
    _DoctorData->>'UIN',
    _DoctorData->>'img',
    _DoctorData->>'Specialization',
    _DoctorData->>'Description'
    );
  end if;
end $$ LANGUAGE plpgsql; 
 

-- Извличане на всички потребители
create or replace function pUserSearch (_ss text, _pos integer, _pageSize integer)
returns table(UserId integer, Username citext, LevelName varchar(50), Name text, Active boolean, total bigint)
 as $$
  select u.UserId, u.Username, l.LevelName, u.Name, u.Active, count(1) over() as total
  from "User" u
  join Level l  on l.LevelId = u.LevelId
  where (_ss is null or u.username like '%' || _ss || '%' or u.name like '%' || _ss || '%')
  ORDER  BY u.UserName
  LIMIT  _PageSize
  OFFSET _pos;
$$ LANGUAGE sql; 


-- Промяна на парола за потребител
create or replace function pUserChangePass (_UserId integer, _Password citext)
returns void
 as $$
  update "User" u
  set Password = _Password
  where UserId = _UserId;
  
$$ LANGUAGE sql; 

-- Активиране деактивиране на потребител
create or replace function pUserChangeActive (_UserId integer)
returns void
 as $$
  update "User" u
  set Active = NOT Active
  where UserId = _UserId;
  
$$ LANGUAGE sql; 


-- -------------------
-- въвеждане на всички параметри по ишу от страна на потребителя
-- извличане на хронични болести
-- извличане на симптоми
-- извличане на времетраене за лекарства
-- извличане на предходни параметри по ишу
-- Поемане на ишу
-- затваряне на ишу
-- извличане на отворени ишута по специалист
-- ---------------------
-- извличане на чат
-- добавяне на елемент в чат
-- извличане на обект за даунлоуд
