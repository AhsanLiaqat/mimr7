# CrisisHub #

**CrisisHub** is application to manage a crisis event by implying and organizing real time information gathering. In addition it also support's tackling the event by implementing a rescue plan based on type of incident. The plan consists of Tasks/ Activities which are assigned to Actors that are part of the CrisisHub ecosystem.

CrisisHub also supports Team Activation and Reporting of every aspect of incidents for future planning.

### Bitbucket Repository ###

* This repository contains the front-end as well as back-end layer of the application. The back-end layer contains APIs for both web and mobile. The technologies used are **AngualrJS** for web front-end, **NodeJS** for back-end, and **Sequelize ORM** for database modeling.
* 0.2
* [CrisisHub Website](http://crisishub.co/newsite/)

### Setup ###
Note: This app requires **NodeJS** and **PostgreSQL** as prerequisite.

* clone the repo using ssh or https link.
* cd to root directory of app.
* set database url in **.env** file according to your local environment.
* install node modules by using *npm install*.
* install angular modules by using *bower install*.
* create and initialize database by using *gulp bootstrap-db*.
* start application by using *gulp server*.