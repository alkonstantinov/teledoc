﻿insert into symptom (SymptomId, SymptomParentId, OrderBy, Symptomname)
values (1, null, 1, 'GENERALSYMPTOMS'),
(2, 1, 2, 'Fever'),
(3, 1, 3, 'Chills'),
(4, 1, 4, 'Headache'),
(5, 1, 5, 'Coughnomucus'),
(6, 1, 6, 'Coughmucus'),
(7, 1, 7, 'Nasalcongestion'),
(8, 1, 8, 'Muscleweakness'),
(9, 1, 9, 'Difficultyswallowing'),
(10, 1, 10, 'Sweating'),
(11, 1, 11, 'Vertigo '),
(12, 1, 12, 'Heartpalpitations'),
(13, 1, 13, 'Fatigue'),
(14, 1, 14, 'Coldflashes'),
(15, 1, 15, 'Warmflashes'),
(16, 1, 16, 'Thirst'),
(17, 1, 17, 'Dizziness'),
(18, 1, 18, 'Eyeredness'),
(19, 1, 19, 'Visionproblems'),
(20, 1, 20, 'Toothache'),
(21, 1, 21, 'Numbnessinhands'),
(22, 1, 22, 'Nosebleed'),
(23, 1, 23, 'Musclecramps '),
(24, 1, 24, 'Decreasedhearing'),
(25, 1, 25, 'Weightgain '),
(26, 1, 26, 'Shortnessofbreath'),
(27, 1, 27, 'Weightloss '),
(28, 1, 28, 'Swellingoflimbs'),
(29, 1, 29, 'Sinusitis'),
(30, 1, 30, 'Drymouth '),
(31, 1, 31, 'Sleepiness'),
(32, 1, 32, 'Wheezing'),
(33, 1, 33, 'Tinnitus '),
(34, null, 34, 'PAIN'),
(35, 34, 35, 'Painmuscle'),
(36, 34, 36, 'Painabdomen'),
(37, 34, 37, 'Painchest'),
(38, 34, 38, 'Painback'),
(39, 34, 39, 'Painlowback'),
(40, 34, 40, 'Painknee'),
(41, 34, 41, 'Painleg'),
(42, 34, 42, 'Painear'),
(43, 34, 43, 'Painpelvice'),
(44, 34, 44, 'Painneck'),
(45, 34, 45, 'Painurinating'),
(46, 34, 46, 'Paintesticles'),
(47, 34, 47, 'Painrectum'),
(48, null, 48, 'DIGESTIVETRACT'),
(49, 48, 49, 'NauseaVomiting'),
(50, 48, 50, 'Diarrhea'),
(51, 48, 51, 'Constipation'),
(52, 48, 52, 'HeartburnReflux'),
(53, 48, 53, 'Gas'),
(54, 48, 54, 'Bloating'),
(55, 48, 55, 'Lossofappetite '),
(56, 48, 56, 'Bloodinstool'),
(57, null, 57, 'DERMATOLOGICAL'),
(58, 57, 58, 'Itching'),
(59, 57, 59, 'Bite'),
(60, 57, 60, 'Rash'),
(61, 57, 61, 'Redness'),
(62, 57, 62, 'Swelling'),
(63, null,63, 'GINECOLOGICAL'),
(64, 63, 64, 'Frequenturination'),
(65, 63, 65, 'Vaginaldischarge'),
(66, 63, 66, 'Peniledischarge'),
(67, 63, 67, 'Bloodinurine'),
(68, 63, 68, 'Vaginalbleeding'),
(69, 63, 69, 'Irregularperiod'),
(70, 63, 70, 'Swellingtesticles'),
(71, null,71, 'PSYCHOLOGICAL'),
(72, 71, 72, 'Аnxiety'),
(73, 71, 73, 'Insomnia'),
(74, 71, 74, 'Depression'),
(75, 71, 75, 'Memoryloss'),
(76, null, 76, 'SPECIAL'),
(77, 76, 77, 'Historyofheartattack'),
(78, 76, 78, 'Historyofstroke'),
(79, 76, 79, 'Foreigntravelpastmonth'),
(80, 76, 80, 'Hospitalizedpastsixmonths')