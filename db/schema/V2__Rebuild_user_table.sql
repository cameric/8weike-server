drop table user;
create table profile (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nickname VARCHAR(255),
    description VARCHAR(255),
    avatar MEDIUMBLOB,
    sex ENUM('Not specified', 'Male', 'Female'),
    PRIMARY KEY (id)
);

create table credential (
    id BIGINT NOT NULL AUTO_INCREMENT,
    phone VARCHAR(255) NOT NULL,
    password_hash CHAR(60) NOT NULL,
    tfa_secret CHAR(60) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    profile_id BIGINT,
    PRIMARY KEY (id),
    UNIQUE (phone),
    FOREIGN KEY (profile_id) REFERENCES profile(id)
);
