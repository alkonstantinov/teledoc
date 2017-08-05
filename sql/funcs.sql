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

--регистрация на потребител
create or replace function pUserRegister (_Username citext, _Password citext, _Name text, _ActivationString citext) 
returns void
 as $$
  insert into "User"
  (
    levelid,
    username,
    password,
    isfb,
    name,
    active,
    activationstring
  )
  values 
  (
    4,
    _Username,
    _Password,
    false,
    _Name,
    false,
    _ActivationString
  );
$$ LANGUAGE sql;  


--активация на потребител
create or replace function pUserActivate (_ActivationString citext) 
returns void
 as $$
  update "User"
  set active = true
  where activationstring = _ActivationString;
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

    update Doctor
    set
      UIN  = _DoctorData->>'UIN',
    img = _DoctorData->>'img',
    Specialization = _DoctorData->>'Specialization',
    Description = _DoctorData->>'Description'
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
create or replace function pIssueSet (_IssueData json)
returns integer
 as $$
 declare _IssueId integer;
 declare _i json;
begin
  insert into Issue 
  (
    PatientUserId,
    ReqExpertLevelId,
    ExpertUserId,
    WhoId,
    GenderId,
    SinceId,
    BirthMonth,
    BirthYear,
    Description,
    Paid  
  )
  values 
  (_IssueData->>'PatientUserId',
  _IssueData->>'ReqExpertLevelId',
  null,
  _IssueData->>'WhoId',
  _IssueData->>'GenderId',
  _IssueData->>'SinceId',
  _IssueData->>'BirthMonth',
  _IssueData->>'BirthYear',
  _IssueData->>'Description',
  _IssueData->>'LevelId'
  )
  returning IssueId into _IssueId;

  FOR _i IN select * from json_array_elements((_IssueData->'Chronic')::json) LOOP
        insert into Issue2Chronic (ChronicId, IssueId, ChronicFree)
        values (_i->'ChronicId', _IssueId, _i->'ChronicFree');
  END LOOP;

  FOR _i IN select * from json_array_elements((_IssueData->'Allergy')::json) LOOP
        insert into Issue2Allergy (IssueId, Allergy)
        values (_IssueId, _i->'Allergy');
  END LOOP;

  FOR _i IN select * from json_array_elements((_IssueData->'Symptom')::json) LOOP
        insert into Issue2Symptom (SymptomId, IssueId)
        values (_i->'SymptomId', _IssueId);
  END LOOP;

  FOR _i IN select * from json_array_elements((_IssueData->'Medication')::json) LOOP
        insert into Issue2Medication (SinceId, IssueId, Medication)
        values (_i->'SinceId', _IssueId, _i->'Medication');
  END LOOP;

  
  return _IssueId; 
end $$ LANGUAGE plpgsql; 



-- извличане на хронични болести
create or replace function pChronicSelect () 
returns table (ChronicId int, ChronicName varchar(100))
 as $$
  select ChronicId, ChronicName
  from Chronic
  order by OrderBy asc
$$ LANGUAGE sql; 

-- извличане на симптоми
create or replace function pSymptomSelect () 
returns table (SymptomId int, SymptomParentId int, SymptomName varchar(100))
 as $$
  select SymptomId, SymptomParentId, SymptomName
  from Symptom
  order by orderby, SymptomParentId asc
$$ LANGUAGE sql; 


-- извличане на времетраене за лекарства
create or replace function pSinceSelect () 
returns table (SinceId int, SinceName varchar(100))
 as $$
  select SinceId, SinceName
  from Since
  
$$ LANGUAGE sql; 


-- извличане на предходни параметри по ишу
create or replace function pIssueLastGet (_UserId int, _WhoId int) 
returns table (IssueId integer)
 as $$
 select max (IssueId)
 from Issue
 where PatientUserId = _UserId and WhoId = _WhoId;
$$ LANGUAGE sql; 

-- Поемане на ишу
create or replace function pIssueAssign (_IssueId int, _ExpertUserId int) 
returns void
 as $$
  update Issue
  set ExpertUserId = _ExpertUserId
  where IssueId = _IssueId;
$$ LANGUAGE sql; 

-- затваряне на ишу
create or replace function pIssueSetStatus (_IssueId int, _IssueStatusId int) 
returns void
 as $$
  update Issue
  set IssueStatusId = _IssueStatusId
  where IssueId = _IssueId;
$$ LANGUAGE sql; 

-- извличане на отворени ишута по специалист
create or replace function pIssueGetOpened (_ReqExpertLevelId int) 
returns table (IssueId int, OnDate timestamp, PatientName text)
 as $$

  select
    i.IssueId,
    (select min(ondate) from IssueEvent where IssueId = i.IssueId) OnDate,
    u.Name
  from Issue i
  join "User" u on u.UserId = i.PatientUserId
  where i.ReqExpertLevelId = _ReqExpertLevelId and i.IssueStatusId = 1;
$$ LANGUAGE sql; 

-- ---------------------

-- извличане на чат
create or replace function pChatGet (_IssueId int) 
returns table (ChatId int, PatientSaid boolean, OnDate timestamp, Said text, ObjId int)
 as $$
  select ChatId, PatientSaid, OnDate, Said, ObjId
  from Chat
  where IssueId = _IssueId
  order by OnDate;
$$ LANGUAGE sql; 


-- добавяне на елемент в чат
create or replace function pChatNewItem (_ChatId int, _PatientSaid boolean, _Said text, _ObjTypeId int, _ObjData bytea, _ObjPreviewData bytea) 
returns integer
 as $$
declare _ObjId integer;
begin
  _ObjId := null;
  if ObjData is not null then
    insert into Obj(ObjTypeId, ObjData, ObjPreviewData)
    values (_ObjTypeId, _ObjData, _ObjPreviewData)
    returning ObjId into _ObjId;
  end if;
  insert into Chat (ChatId, PatientSaid, Said, ObjId, OnDate)
  values (_ChatId, _PatientSaid, _Said, _ObjId, now());
  return _ObjId; 
end  
$$ LANGUAGE plpgsql; 


-- извличане на обект

create or replace function pObjGet (_ObjId int)
returns table (ObjTypeId int, ObjData bytea, ObjPreviewData bytea)
as $$
  select ObjTypeId, ObjData, ObjPreviewData
  from Obj
  where ObjId = _ObjId;
$$ LANGUAGE sql;



-- Извличане на данни за ишу
create or replace function pIssueGet (_IssueId int) 
returns json
 as $$
declare result json;
_i json;
begin
  FOR result in select row_to_json (Issue) from Issue where IssueId = _IssueId LOOP END LOOP;

  result := jsonb_set( result::jsonb,'{Chronic}','[]');
  FOR _i IN select row_to_json (Issue2Chronic)from Issue2Chronic where IssueId = _IssueId LOOP
    result := jsonb_insert(result ::jsonb,'{Chronic,1}',_i::jsonb);
  end loop;
  
  result := jsonb_set( result::jsonb,'{Allergy}','[]');
  FOR _i IN select row_to_json (Issue2Allergy)from Issue2Allergy where IssueId = _IssueId LOOP
    result := jsonb_insert(result ::jsonb,'{Allergy,1}',_i::jsonb);
  end loop;
    
  result := jsonb_set( result::jsonb,'{Symptom}','[]');
  FOR _i IN select row_to_json (Issue2Symptom)from Issue2Symptom where IssueId = _IssueId LOOP
    result := jsonb_insert(result ::jsonb,'{Symptom,1}',_i::jsonb);
  end loop;


  result := jsonb_set( result::jsonb,'{Medication}','[]');
  FOR _i IN select row_to_json (Issue2Medication)from Issue2Medication where IssueId = _IssueId LOOP
    result := jsonb_insert(result ::jsonb,'{Medication,1}',_i::jsonb);
  end loop;
  
  return result;
end  
$$ LANGUAGE plpgsql; 
