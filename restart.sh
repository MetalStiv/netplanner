!#/bin/bash
docker-compose down
./genRsaKeys.sh
docker-compose up -d