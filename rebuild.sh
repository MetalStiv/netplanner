!#/bin/bash
docker-compose down
./genRsaKeys.sh
docker rmi metalstiv/user_microservice:1.0
docker build -t metalstiv/user_microservice:1.0 ./UserMicroservice
docker-compose up -d