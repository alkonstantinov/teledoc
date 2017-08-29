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
 _img bytea;
begin
  if (_DoctorData->>'UserId' != '') then
    update "User"
    set
      LevelId = (_DoctorData->>'LevelId')::int,
      Name = _DoctorData->>'Name'
    where UserId = (_DoctorData->>'UserId')::int;

    _img := (_DoctorData->>'img')::bytea;

    update Doctor
    set
      UIN  = _DoctorData->>'UIN',
    img = case _img when '' then img else _img end,
    Specialization = _DoctorData->>'Specialization',
    Description = _DoctorData->>'Description'
    where UserId = (_DoctorData->>'UserId')::int;
  else
    insert into "User" 
    (LevelId, 
    UserName, 
    Password, 
    IsFB, 
    Name, 
    Active)
    values 
    ((_DoctorData->>'LevelId')::int,
    _DoctorData->>'UserName',
    _DoctorData->>'Password',
    (_DoctorData->>'IsFB')::boolean,
    _DoctorData->>'Name',
    (_DoctorData->>'Active')::boolean)
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
    (_DoctorData->>'img')::bytea,
    _DoctorData->>'Specialization',
    _DoctorData->>'Description'
    );
  end if;
  return _UserId;
end $$ LANGUAGE plpgsql; 
 
-- drop function pUserSearch (_ss text, _pos integer, _pageSize integer)
-- Извличане на всички потребители
create or replace function pUserSearch (_ss text, _pos integer, _pageSize integer)
returns table(UserId integer, Username citext, LevelId int, LevelName varchar(50), Name text, Active boolean, total bigint)
 as $$
  select u.UserId, u.Username, l.LevelId, l.LevelName, u.Name, u.Active, count(1) over() as total
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

-- Промяна на парола при забравена
--drop function pUserChangePass (_UserName citext, _Password citext)
create or replace function pChangeLostPass (_UserName citext, _Password citext)
returns void
 as $$
  update "User" u
  set Password = _Password
  where UserName = _UserName;
  
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
    IssueStatusId,
    WhoId,
    GenderId,
    SinceId,
    BirthMonth,
    BirthYear,
    Description,
    AnswerTypeId,
    AdditionalInfo,
    Paid
  )
  values 
  (
    (_IssueData->>'patientuserid')::int,
    (_IssueData->>'reqexpertlevelid')::int,
    null,
    1,
    (_IssueData->>'whoid')::int,
    _IssueData->>'sexid',
    (_IssueData->>'sinceid')::int,
    (_IssueData->>'birthmonth')::int,
    (_IssueData->>'birthyear')::int,
    _IssueData->>'description',
    (_IssueData->>'answertypeid')::int,
    _IssueData->>'additionalinfo',
    false
  )
  returning IssueId into _IssueId;

  FOR _i IN select * from json_array_elements((_IssueData->'chronic')::json) LOOP
        insert into Issue2Chronic (ChronicId, IssueId, ChronicFree)
        values ((_i->>'chronicid')::int, _IssueId, _i->>'chronicfree');
  END LOOP;

  FOR _i IN select * from json_array_elements((_IssueData->'allergy')::json) LOOP
        insert into Issue2Allergy (IssueId, Allergy)
        values (_IssueId, _i->>'allergy');
  END LOOP;

  FOR _i IN select * from json_array_elements((_IssueData->'symptom')::json) LOOP
        insert into Issue2Symptom (SymptomId, IssueId)
        values ((_i->>'symptomid')::int, _IssueId);
  END LOOP;

  FOR _i IN select * from json_array_elements((_IssueData->'medication')::json) LOOP
        insert into Issue2Medication (SinceId, IssueId, Medication)
        values ((_i->>'sinceid')::int, _IssueId, _i->>'medication');
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
  set ExpertUserId = _ExpertUserId, IssueStatusId=2
  where IssueId = _IssueId;
  
  insert into IssueEvent(issueid, issuestatusid,ondate)
  values(_IssueId, 2, now())
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
--drop function pChatGet (_IssueId int) 
create or replace function pChatGet (_IssueId int) 
returns table (ChatId int, UserId int, OnDate timestamp, Said text, ObjId int, Name text)
 as $$
  select c.ChatId, c.UserId, c.OnDate, c.Said, c.ObjId, u.Name
  from Chat c
  join "User" u on c.UserId = u.UserId
  where IssueId = _IssueId
  order by OnDate;
$$ LANGUAGE sql; 


-- добавяне на елемент в чат
--drop function pChatNewItem (_ChatId int, _UserId int, _Said text, _ObjTypeId int, _ObjData bytea, _ObjPreviewData bytea)  
create or replace function pChatNewItem (_IssueId int, _UserId int, _Said text, _ObjTypeId int, _ObjData bytea, _ObjPreviewData bytea) 
returns integer
 as $$
declare _ObjId integer;
begin
  _ObjId := null;
  if _ObjData is not null then
    insert into Obj(ObjTypeId, ObjData, ObjPreviewData)
    values (_ObjTypeId, _ObjData, _ObjPreviewData)
    returning ObjId into _ObjId;
  end if;
  insert into Chat (IssueId, UserId, Said, ObjId, OnDate)
  values (_IssueId, _UserId, _Said, _ObjId, now());
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
--select * from pIssueGet (6)
create or replace function pIssueGet (_IssueId int) 
returns json
 as $$
declare result json;
_i json;
begin
  FOR result in 
    
SELECT row_to_json(
        (SELECT x FROM 
          (SELECT
            *,
            (select json_agg(row_to_json(Allergies)) FROM (select * from Issue2Allergy where issueid = i.issueid) Allergies) as Allergies,
            (select json_agg(row_to_json(Chronics)) FROM (select * from Issue2Chronic i2c join Chronic c on c.ChronicId = i2c.ChronicId where issueid = i.issueid) Chronics) as Chronics,
            (select json_agg(row_to_json(Medications)) FROM (select * from Issue2Medication i2m join Since s on s.SinceId = i2m.SinceId where issueid = i.issueid) Medications) as Medications,
            (select json_agg(row_to_json(Symptoms)) FROM (select * from Issue2Symptom i2s join Symptom s on s.SymptomId = i2s.SymptomId where issueid = i.issueid) Symptoms) as Symptoms
           from issue i
           join "User" u on u.UserId =i.PatientUserId
           join who w on w.whoid = i.whoid
           join issuestatus ist on ist.issuestatusid =i.issuestatusid
           join Level l on l.LevelId = i.ReqExpertLevelId 
           join Gender g on g.GenderId = i.GenderId
           join Since s on s.SinceId=i.SinceId
           join AnswerType atp on atp.AnswerTypeId = i.AnswerTypeId
           where i.issueid=_IssueId  
        ) x),
        true
)
LOOP END LOOP;
  return result;
end  
$$ LANGUAGE plpgsql; 
--drop function pDoctorGet (_userId int)
create or replace function pDoctorGet (_userId int)
returns table (UserName citext, Name text, LevelId int, UIN varchar (50), Specialization text,  Description text)
as $$
  select u.UserName, u.Name, u.LevelId, d.UIN, d.specialization, d.description
  from "User" u
  join Doctor d on d.UserId = u.UserId
  where u.UserId = _userId;
$$ LANGUAGE sql;

create or replace function pDoctorImageGet (_userId int)
returns table (img bytea)
as $$
  select d.img
  from Doctor d
  where d.UserId = _userId;
$$ LANGUAGE sql;

-- извличане на отворени и непоети ишута по пациент
--drop function pIssueGetNotClosed (_PatientUserId int) 
create or replace function pIssueGetNotClosed (_PatientUserId int) 
returns table (IssueId int, OnDate timestamp, Description text, StatusId int, StatusName varchar(50))
 as $$

  select
    i.IssueId,
    (select min(ondate) from IssueEvent where IssueId = i.IssueId) OnDate,
    i.Description,
    st.IssueStatusId,
    st.IssueStatusName
  from Issue i
  join IssueStatus st on st.IssueStatusId = i.IssueStatusId
  where i.PatientUserId = _PatientUserId and i.IssueStatusId in (1,2);
$$ LANGUAGE sql; 

-- извличане на отворени и непоети ишута по вид експерт
--drop function pIssueGetNotClosed (_PatientUserId int) 
--select * from pIssueGetByExpert(1);
create or replace function pIssueGetByExpert (_LevelId int) 
returns table (IssueId int, OnDate timestamp, Description text)
 as $$

  select
    i.IssueId,
    (select min(ondate) from IssueEvent where IssueId = i.IssueId) OnDate,
    i.Description
  from Issue i
  where i.ReqExpertLevelId = _LevelId and i.IssueStatusId =1;
$$ LANGUAGE sql; 

--Дашборд
--select * from pDashBoard () 
create or replace function pDashBoard () 
returns table (regpatientscount bigint, regdoctorscount bigint, regpharmacistscount bigint, openissuescount bigint, takenissuescount bigint, closedissuesforweekcount bigint)
 as $$

  select
    (select count(1) from "User" where active='t' and levelid = 4),
    (select count(1) from "User" where active='t' and levelid = 2),
    (select count(1) from "User" where active='t' and levelid = 3),
    (select count(1) from issue where issuestatusid=1),
    (select count(1) from issue where issuestatusid=2),
    (
      select count(1) 
      from issue i
      join issueevent ie on ie.issueid = i.issueid
      left join issueevent ie2 on ie2.issueid = i.issueid and ie2.issueeventid>ie.issueeventid
      where i.issuestatusid=3 and ie2.issueeventid is null and ie.ondate>(now()::date-7)::date

    );
$$ LANGUAGE sql; 
