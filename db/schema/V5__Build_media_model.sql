CREATE TABLE media (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    cdn_name VARCHAR(255) NOT NULL,
    cdn_location VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE post_collection (
    post_id BIGINT NOT NULL,
    media_id BIGINT NOT NULL,
    PRIMARY KEY (post_id, media_id),
    FOREIGN KEY (post_id) REFERENCES post(id),
    FOREIGN KEY (media_id) REFERENCES media(id)
);
