docker-compose down
docker rmi metalstiv/user_microservice:1.0
echo "Image has been removed"
docker build -t metalstiv/user_microservice:1.0 ./UserMicroservice
docker-compose up -d