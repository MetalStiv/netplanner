!#/bin/bash
docker-compose down
./genRsaKeys.sh
docker rmi metalstiv/user_microservice:1.0
docker build -t metalstiv/user_microservice:1.0 ./UserMicroservice
docker rmi metalstiv/project_microservice:1.0
docker build -t metalstiv/project_microservice:1.0 ./ProjectMicroservice
docker-compose up -d