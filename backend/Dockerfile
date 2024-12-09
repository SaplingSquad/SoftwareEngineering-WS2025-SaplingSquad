FROM gradle:8-jdk21-alpine AS build
WORKDIR /build
COPY --chown=gradle:gradle . /build
RUN gradle buildFatJar --no-daemon

FROM openjdk:21-slim AS run
WORKDIR /app
COPY --from=build /build/build/libs/backend.jar /app/backend.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/backend.jar"]