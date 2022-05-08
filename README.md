# antifreeze #
NodeJS backend based on SSE, MQTT, KOA, JOI. Smart dacha

## install ##
npm ci
npm run migrate
npm run seed
openssl genrsa -out key/private.pem 2048
openssl rsa -in key/private.pem -outform PEM -pubout -out key/public.pem

## run ##
npm start

## test ##
npm test
