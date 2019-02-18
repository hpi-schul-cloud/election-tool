# Schul-Cloud Election Tool

This repository encompasses both frontend and server code for the election tool developed
to be deployed in the HPI Schul-Cloud in Potsdam.

This readme will guide you through the setup steps.

## Project Setup

In general you will need [NodeJS](https://nodejs.org/en/) for both front- and backend as
well as [MongoDB](https://www.mongodb.com/download-center/community) for the backend.
Using the Community Server (linked) is enough. It is however recommended to use a tool
like [Studio 3T](https://robomongo.org/) to visualize the database content you create during testing.
A local Installation of Git will also be assumed.

### Frontend

All code needed for the election tool frontend is contained in the frontend folder.

1. clone this repository
``
git clone https://gitlab.hpi.de/lukas.budach/election-tool.git
``

2. you need to navigate into the election-tool-frontend folder
``
cd election-tool-frontend
``

3. download and locally install all required node modules 
``
npm install
``

Now the frontend is ready to go and you can continue setting up the
database and backend.

### MongoDB with Docker

1.  [install Docker](https://www.docker.com/products/docker-desktop) 

2.  switch into the `election-tool-database` folder and run:
    ``
    docker-compose up
    ``

### MongoDB without Docker

1.  install MongoDB

2.  add the binary folder at the install location to your system path. The path to this directory usually looks something like this: 
    ```
    C:\Program Files\MongoDB\Server\3.6\bin
    ```
    
3.  add the git binary folder to your system path. It may be located in a directory like this:
    ```
    C:\Program Files\Git\bin
    ```
    
4.  restart your terminal

5.  create a folder for your database in the election-tool directory, for example 
``
election-tool-database
``

6.  start the database by executing:
``
mongod --bind_ip 0.0.0.0 --port 3100 --dbpath "C:\..\election-tool\election-tool-database"
``

This causes it to be hosted on your local ip port 3100. You can access the database at 
[yourLocalIPv4]:3100 as well as localhost:3100. Now just keep MongoDB running  until you
are done with working on front- and backend.

### Backend

1.  clone this repository

2.  open a terminal and navigate into the election-tool-backend folder
``
cd election-tool-backend
``
3.  download and locally install all required node modules 
``
npm install
``

Once you have done this you are ready to run the project.

### Configuration

There are two configurations currently available for this project.
1.  **localDevelopment** sets hosts and paths in a way that only allows the project to run
on a single machine. Using this configuration mode requires you to access every part of
the front- and backend through localhost:[port]. This mode is recommended for the regular
development.

2.  **multiDeviceDevelopment** requires you to set the paths to server and database to your 
local IPv4 in the config.json files in both frontend and backend. Those can be found in
the config directories in both projects. This mode needs to be used when wanting to run
server and frontend on multiple different devices within the same network. Front- and
backend can be accessed through [yourIP]:[port]. This configuration is recommended for
testing the developments made on multiple different devices. 

The config mode used by default is localDevelopment. Before running front- or backend you may want to change the used configuration in the
following files:
* Frontend
    * src\main.js
    * config\index.js
* Backend
    * config.js

## Run Project

### Database

start the database by executing:
``
mongod --bind_ip 0.0.0.0 --port 3100 --dbpath "C:\..\election-tool\election-tool-database"
``

OR if using docker:
``
docker-compose up
``

### Backend

1.  navigate to the directory
``
election-tool-backend\dataGeneration
``

2.  to populate the database run 
``
node fillWithDebugData.js
``
to create elections as well as some candidates and votes

    **!!! If there are errors while populating the database try rerunning the script until
no more errors are printed to your console !!!**

3.  navigate back to the directory 
``
election-tool-backend
``

4.  start the server by calling
``
node app.js
``

The server will run on port
``
3000
``

### Frontend

1.  open a console and navigate to the election-tool-frontend directory

2.  start the frontend with: 
``
npm run dev
``

You should now be able to view the frontend at 
[localhost:8080](localhost:8080). 

The link above will take you to the regular election selection page and assign you a random
student name and id from the database for debug purposes. Upon reloading the page
a different student is assigned to your session.

It is however to note, that accessing the election dashboard visible to the election creater
through anything but the intended path of using the election selection page (startpage) is
not recommended as it may produce undesired results and impair the functions of the
page significantly!

## Further Documentation
There exist a documentation of the [backend routes](./election-tool-backend/API.md) as well as one for the [frontend Vue components](./election-tool-frontend/Documentation.md). 

If you are trying to integrate this tool into Schul-Cloud have a look at our [thoughts on that](./schulcloud-integrierung.md).
