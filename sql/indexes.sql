create index idx_User_LevelId on "User"(Levelid);
create index idx_Doctor_UserId on Doctor(UserId);


create index idx_Patient_UserId on Patient(UserId);
create index idx_Patient_PayTypeId on Patient(PayTypeId);
create index idx_Issue_IssueStatusId on Issue(IssueStatusId);
create index idx_Issue_PatientUserId on Issue(PatientUserId);
create index idx_Issue_ReqExpertLevelId on Issue(ReqExpertLevelId);
create index idx_Issue_ExpertUserId on Issue(ExpertUserId);
create index idx_Issue_WhoId on Issue(WhoId);
create index idx_Issue_GenderId on Issue(GenderId);
create index idx_Issue_SinceId on Issue(SinceId);
create index idx_Issue_AnswerTypeId on Issue(AnswerTypeId);
create index idx_IssueEvent_IssueId on IssueEvent(IssueId);
create index idx_IssueEvent_IssueStatusId on IssueEvent(IssueStatusId);
create index idx_Issue2Chronic_ChronicId on Issue2Chronic(ChronicId);
create index idx_Issue2Chronic_IssueId on Issue2Chronic(IssueId);
create index idx_Issue2Allergy_IssueId on Issue2Allergy(IssueId);
create index idx_Symptom_SymptomParentId on Symptom(SymptomParentId);
create index idx_Issue2Symptom_SymptomId on Issue2Symptom(SymptomId);
create index idx_Issue2Symptom_IssueId on Issue2Symptom(IssueId);
create index idx_Chat_IssueId on Chat(IssueId);
create index idx_Chat_UserId on Chat(UserId);
create index idx_Issue2Medication_IssueId on Issue2Medication(IssueId);
create index idx_Issue2Medication_SinceId on Issue2Medication(SinceId);
