create table USER (
    P_ID BIGINT not null,       -- In case we ever have > 4.3 billion users...
    phone TINYTEXT not null,    -- 
    nickname TINYTEXT,
    description TINYTEXT,
    avatar MEDIUMBLOB,
    sex ENUM('Male', 'Female', 'Other')
);
