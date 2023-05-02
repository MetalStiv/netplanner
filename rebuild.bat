docker-compose down
call genRsaKeys.bat
docker rmi licht9estalt/user_microservice:1.0
docker build -t licht9estalt/user_microservice:1.0 ./UserMicroservice
docker rmi licht9estalt/project_microservice:1.0
docker build -t licht9estalt/project_microservice:1.0 ./ProjectMicroservice
docker rmi licht9estalt/action_microservice:1.0
dir D:\Netplanner\ActionMicroservice\src\*.ts /b /s > ts-files.txt
call npx tsc @ts-files.txt --outDir ./ActionMicroservice/dist --downlevelIteration
del ts-files.txt
docker build -t licht9estalt/action_microservice:1.0 ./ActionMicroservice
docker-compose up -d