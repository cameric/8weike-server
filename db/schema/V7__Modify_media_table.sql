ALTER TABLE media ADD COLUMN (medium_name VARCHAR(255),
                              medium_location VARCHAR(255),
                              thumbnail_name VARCHAR(255),
                              thumbnail_location VARCHAR(255));
ALTER TABLE media CHANGE COLUMN cdn_name orig_name VARCHAR(255);
ALTER TABLE media CHANGE COLUMN cdn_location orig_location VARCHAR(255);
