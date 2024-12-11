# Backend

Make sure you are in the `backend/` folder to execute this commands.

## Building the backend

Linux:
```shell
./gradlew bootRun
```

Windows:
```shell
./gradlew.bat bootRun
```

## Code Generation
If the api changes the code generation is executed. You should clean the build
files in this case.

Linux:
```shell
./gradlew clean
```

Windows:
```shell
./gradlew.bat clean
```

## Combine

You can combine both commands on Linux.

Linux:
```shell
./gradlew clean && ./gradlew bootRun
```
## Development

The backend is written in [kotlin](https://kotlinlang.org/) it is recommended to
use IntelliJ for development.
