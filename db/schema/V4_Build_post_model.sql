CREATE TABLE post {
  id BIGINT NOT NULL AUTO_INCREMENT,
  profile_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  created_at DATE NOT NULL,
  PRIMARY KEY (id)
  FOREIGN KEY (profile_id) REFERENCES profile(id)
}
