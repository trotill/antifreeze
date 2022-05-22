# antifreeze #
NodeJS backend based on SSE, MQTT, KOA, JOI, Sequelize, Mocha, Sqlite.

## description

A comprehensive system for solving problems in my country house.
The hardware is based on esp32 and is located in the basement of the house. The board sends data to the MQTT broker over the internet every second.
The backend communicates with the board through an MQTT broker and additionally stores the received data in the database.
The frontend interacts with the backend.

Backend features (https://github.com/trotill/antifreeze):
- communicates with the esp32 board via MQTT,
- saves the received data (events and sensor values) in the database,
- monitors the overflow of the database and cleans up,
- allows you to upload data averaged over 10 seconds, minutes, hours, days,
- differentiates access of several users from different groups,
- implements server pagination,
- checks and regenerates JWT tokens on each request

Frontend features (https://github.com/trotill/antifreezeFront/):
- esp32 board management,
- interaction with the database using server-side pagination,
- display of events and alarms,
- display of sensor values,
- user registration is possible (two user groups are available admin and user),
- authentication with JWT token,
- 100% mobile rubber design

<img src="https://github.com/trotill/antifreezeFront/blob/main/demo/registration.png" width="100"/><img src="https://github.com/trotill/antifreezeFront/blob/main/demo/footer.png" width="100"/><img src="https://github.com/trotill/antifreezeFront/blob/main/demo/events.png" width="100"/><img src="https://github.com/trotill/antifreezeFront/blob/main/demo/History.png" width="100"/><img src="https://github.com/trotill/antifreezeFront/blob/main/demo/profileAdmin.png" width="100"/><img src="https://github.com/trotill/antifreezeFront/blob/main/demo/settings.png" width="100"/>

## install ##
npm ci

npm run migrate

npm run seed

openssl genrsa -out key/private.pem 2048

openssl rsa -in key/private.pem -outform PEM -pubout -out key/public.pem

rename .env_default to .env

## run ##
npm start

## test ##
npm test

## Gallery
<img src="https://github.com/trotill/antifreezeFront/blob/main/demo/registration.png" width="400"/><img src="https://github.com/trotill/antifreezeFront/blob/main/demo/footer.png" width="400"/>
<img src="https://github.com/trotill/antifreezeFront/blob/main/demo/events.png" width="400"/><img src="https://github.com/trotill/antifreezeFront/blob/main/demo/History.png" width="400"/>
<img src="https://github.com/trotill/antifreezeFront/blob/main/demo/profileAdmin.png" width="400"/><img src="https://github.com/trotill/antifreezeFront/blob/main/demo/settings.png" width="400"/>
