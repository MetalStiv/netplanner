!#/bin/bash
openssl genrsa -out ./RsaKeys/private.pem 2048
openssl rsa -in ./RsaKeys/private.pem -pubout -out ./RsaKeys/public.pem