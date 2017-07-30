CREATE EXTENSION IF NOT EXISTS citext;

drop table if exists Level CASCADE;
create table Level
(
  LevelId int not null primary key,
  LevelName varchar(50)
);
insert into Level (LevelId, LevelName)
values (1, 'Administrator'),(2, 'Doctor'),(3, 'Pharmacist'),(4, 'Patient');

drop table if exists Gender CASCADE;
create table Gender
(
  GenderId char(1) not null primary key,
  GenderName varchar(20)
);
insert into Gender (GenderId, GenderName) values ('m', 'male'), ('f', 'female'), ('b','both');


drop table if exists "User" CASCADE;
create table "User"
(
  UserId SERIAL primary key,
  LevelId int not null references Level(LevelId),
  UserName citext not null,
  Password citext not null,
  IsFB boolean not null,
  Name text,
  Active boolean not null default true
  
);
insert into "User" (LevelId, UserName, Password, IsFB)
values (1, 'admin', '202cb962ac59075b964b07152d234b70', false);


drop table if exists Doctor CASCADE;
create table Doctor
(
  DoctorId SERIAL primary key,
  UserId int not null references "User"(UserId),
  UIN varchar (50),
  img bytea,
  Specialization text,
  Description text  
);


drop table if exists PayType CASCADE;
create table PayType
(
  PayTypeId int not null primary key,
  PayTypeName varchar(50)
);
insert into PayType (PayTypeId, PayTypeName)
values (1, 'PayNone'), (2, 'PayMonthly');

drop table if exists Patient CASCADE;
create table Patient
(
  PatientId SERIAL primary key,
  UserId int not null references "User"(UserId),
  PayTypeId int not null references PayType(PayTypeId),
  EndDate date
);


drop table if exists Who CASCADE;
create table Who
(
  WhoId int not null primary key,
  WhoName varchar(50)
);
insert into Who (WhoId, WhoName)
values (1, 'Ме'),(2, 'Mychild'),(3, 'Someoneelse');

drop table if exists IssueStatus CASCADE;
create table IssueStatus
(
  IssueStatusId int not null primary key,
  IssueStatusName varchar(50)
);
insert into IssueStatus (IssueStatusId, IssueStatusName)
values (1, 'Initial'),(2, 'Taken'),(3, 'Done');

drop table if exists Since CASCADE;
create table Since
(
  SinceId int not null primary key,
  SinceName varchar(50)
);
insert into Since (SinceId, SinceName)
values (1, 'Today'),(2, 'Yesterday'),(3, 'Week'),(4, 'Month'),(5, 'Year'),(6, 'Year+');


drop table if exists Issue CASCADE;
create table Issue
(
  IssueId SERIAL primary key,
  IssueStatusId int not null references IssueStatus (IssueStatusId),
  PatientUserId int not null references "User"(UserId),
  ReqExpertLevelId int not null references Level(LevelId),
  ExpertUserId int references "User"(UserId),
  WhoId int not null references Who(WhoId),
  GenderId char(1) not null references Gender(GenderId),
  SinceId int null references Since(SinceId),
  BirthMonth smallint,
  BirthYear int,
  Description text not null, 
  Paid boolean not null  
);

drop table if exists IssueEvent CASCADE;
create table IssueEvent
(
  IssueEventId SERIAL primary key,
  IssueId int not null references Issue (IssueId),
  IssueStatusId int not null references IssueStatus (IssueStatusId),
  OnDate timestamp not null
);

drop table if exists Chronic CASCADE;
create table Chronic
(
  ChronicId int not null primary key,
  ChronicName varchar(100),
  OrderBy int not null
);

drop table if exists Issue2Chronic CASCADE;
create table Issue2Chronic
(
  Issue2ChronicId SERIAL not null primary key,
  ChronicId int not null references Chronic(ChronicId),
  IssueId int not null references Issue(IssueId),
  ChronicFree varchar(100)
);


drop table if exists Issue2Allergy CASCADE;
create table Issue2Allergy
(
  Issue2AllergyId SERIAL not null primary key,
  IssueId int not null references Issue(IssueId),
  Allergy varchar(100)
);


drop table if exists Symptom CASCADE;
create table Symptom
(
  SymptomId SERIAL not null primary key,
  SymptomParentId int references Symptom(SymptomId),
  SymptomName varchar(100),
  OrderBy int
);

drop table if exists Issue2Symptom CASCADE;
create table Issue2Symptom
(
  Issue2SymptomId SERIAL not null primary key,
  SymptomId int not null references Symptom(SymptomId),
  IssueId int not null references Issue(IssueId)
);

drop table if exists ObjType CASCADE;
create table ObjType
(
  ObjTypeId int not null primary key,
  ObjTypeName varchar(50)
);
insert into ObjType (ObjTypeId, ObjTypeName)
values (1, 'Image'),(2, 'Video'),(3, 'Audio');

drop table if exists Obj CASCADE;
create table Obj
(
  ObjId SERIAL not null primary key,
  ObjTypeId int not null references ObjType(ObjTypeId),
  ObjData bytea not null,
  ObjPreviewData bytea not null
);


drop table if exists Chat CASCADE;
create table Chat
(
  ChatId SERIAL not null primary key,
  IssueId int not null references Issue(IssueId),
  PatientSaid boolean not null,
  OnDate timestamp,
  Said text not null,
  ObjId int references Obj(ObjId)
);


drop table if exists Issue2Medication CASCADE;
create table Issue2Medication
(
  Issue2MedicationId SERIAL not null primary key,
  SinceId int not null references Since(SinceId),
  Medication varchar(100),
  IssueId int not null references Issue(IssueId)
);
