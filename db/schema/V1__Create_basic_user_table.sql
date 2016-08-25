create table user (
    id BIGINT NOT NULL AUTO_INCREMENT,
    phone VARCHAR(255) NOT NULL,
    password_hash CHAR(60) NOT NULL,
    totp_secret CHAR(30),
    nickname VARCHAR(255),
    description VARCHAR(255),
    avatar MEDIUMBLOB,
    sex ENUM('Male', 'Female', 'Not specified'),
    PRIMARY KEY (id),
    UNIQUE (phone)
);
