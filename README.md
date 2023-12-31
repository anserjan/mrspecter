[![pipeline status](../../../badges/main/pipeline.svg)](../../../pipelines/latest)
[![pipeline status](../../../badges/main/coverage.svg)](../../../pipelines/latest)
# Backend


## Name
MrSpecter Backend

## Description
Node.js REST Server for the mobilegame Mr. Specter. This Server manages the gps-location exchange and users.
Mr. Specter is a location based mobilegame which will be available on the playstore and appstore. The game works as follows:
Group of player meet and join a lobby.
A user's role is that of the fleeing Mr.Specter, whose location is broadcast to all other users at a defined interval.
The rest of the group tries to catch the Mr. Specter within the set time and the defined radius.

## Setup

#### Setup local repository
```
git clone https://gitlab.bht-berlin.de/mr-specter/backend.git
```
```
cd ./backend
```

Install dependencies
```
npm install
```


Run tests (Doesn't need a MongoDB database setup as it uses the [MongoDB In-Memory Server](https://github.com/nodkz/mongodb-memory-server))

```
npm test
```

**Production Like Environment**:

If you want to start the main app and store data in a real database you need to install mongodb and start a server:

[MongoDB install instructions](https://www.mongodb.com/docs/manual/administration/install-community/)

start MongoDB (system specific instruction -> link above), this example shows the M1 Mac brew version run in the foreground
```
mongod --config /opt/homebrew/etc/mongod.conf
```

Then you can start the main Node.js server via npm
```
npm start
```

## Support

## Contributing

## Authors and acknowledgment
* Anser Janczyk 916834
* Mike Bewersdorf 861414
* Sami Tondl 916882
* Sophie Brenneisen 896873
* Joshua Dürr 914134
* Aaron Friesel 912960

## License
For open source projects, say how it is licensed.

## Project status
In active development until start of 2023
