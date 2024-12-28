FROM gradle:8-jdk21-alpine AS build
WORKDIR /build
COPY --chown=gradle:gradle ./backend /build
COPY --chown=gradle:gradle ./api /build/api
ENV API_ROOT="/build/api"
RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21 AS run
WORKDIR /app
COPY --from=build /build/build/libs/backend.jar /app/backend.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/backend.jar"]