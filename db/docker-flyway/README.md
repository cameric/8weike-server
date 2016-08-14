# Flyway 4.0.3 image for Docker

This folder contains resources for building a custom Flyway image for Docker.
You can either build this package manually with `docker build` or specify it
in `docker-compose.yml` to have it built automatically.

## Running Flyway
Once the Flyway image is built, simply run

```
docker-compose run --rm flyway [args]
```

where `[args]` represents Flyway's usual arguments. Be sure to include the
`--rm` flag to remove the container after running it, since the container does
not stay active --- it just runs the `flyway` command before exiting.
