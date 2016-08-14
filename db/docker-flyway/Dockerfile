FROM java:7

RUN wget https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/4.0.3/flyway-commandline-4.0.3.tar.gz
RUN tar -xzf flyway-commandline-4.0.3.tar.gz
RUN mv /flyway-4.0.3 /flyway && ln -s /flyway/flyway /usr/local/bin/flyway

WORKDIR /flyway

ENTRYPOINT ["flyway"]
CMD ["migrate"]
