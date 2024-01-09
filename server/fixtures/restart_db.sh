source .env
if [[ $1 == 'prod' ]]
then
  URL=mongodb+srv://${MONGO_USERNAME}:${MONGO_PW}@${MONGO_PROD}
else
  URL=mongodb+srv://${MONGO_USERNAME}:${MONGO_PW}@${MONGO_DEV}
fi
mongosh $URL < fixtures/dropDb.js

if [[ $1 != 'prod' ]]
then
  mongoimport fixtures/dev/gyms.json mongodb+srv://vishaalagartha:ilostmylaptop123@setmea-dev.b6nwjq5.mongodb.net/ --jsonArray
  mongoimport fixtures/dev/routes.json mongodb+srv://vishaalagartha:ilostmylaptop123@setmea-dev.b6nwjq5.mongodb.net/ --jsonArray
  mongoimport fixtures/dev/users.json mongodb+srv://vishaalagartha:ilostmylaptop123@setmea-dev.b6nwjq5.mongodb.net/ --jsonArray
fi
