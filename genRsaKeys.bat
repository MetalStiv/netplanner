call openssl genrsa -out ./RsaKeys/private.pem 2048
call openssl rsa -in ./RsaKeys/private.pem -pubout -out ./RsaKeys/public.pem