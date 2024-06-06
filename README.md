2. 
You are provided some starter code that implements a solution the 1st solution. The starter code's API server is implemented in server.js, and individual routes are modularized within the api/ directory. Tests and a testing environment for the API are included in the tests/ directory. You can import these tests into either Postman or Insomnia and build on them if you like. Note that, depending on where you're running your API server, you may need to update the baseUrl variable in the included testing environment to reflect the URL for your own server.

The starter code also includes an openapi.yaml file in the public/ directory. You can import this file into the OpenAPI editor at https://editor.swagger.io/ to generate documentation for the server to see how its endpoints are set up.

Feel free to use this code as your starting point. You may also use your own solution to as your starting point if you like.
-----------------------------------------------------------------------------------------------------------------------------
Use a database to power your API
Your overarching goal for this assignment is to modify the API server to use a database to store the following resources:

Businesses
Reviews
Photos
Use MongoDB for this purpose, it should completely replace the starter code's existing JSON/in-memory storage for these resources. In other words, you should update all API endpoints in the original starter code to use your database.
You should use the official MongoDB Docker image from Docker Hub to power your database. More criteria described below.
-----------------------------------------------------------------------------------------------------------------------------
Database initialization
Before you run your application for the first time, you'll have to make sure your database is initialized and ready to store your application data. Use the mechanisms described below to initialize your database when you launch the database container, so the database is ready to use when you launch your app.
MongoDB
When MongoDB, you should make sure to set the following environment variables when launching your database container (you can read more under the "Environment Variables" section of the MongoDB Docker image docs):

MONGO_INITDB_ROOT_USERNAME and MONGO_INITDB_ROOT_USERNAME - These are used to create the MongoDB root user.
MONGO_INITDB_DATABASE - This specifies the name of a MongoDB database to be created when your container first starts.
While it is a security risk to do so in a production setting, it's fine if you interact with the database from your API server as the ROOT user for this project. Because MongoDB generally uses a "create on first use" approach, you won't have to worry about initializing collections.
-----------------------------------------------------------------------------------------------------------------------------
Database organization
Your database should store all resource data (i.e. businesses, photos, and reviews) for the API. Because the resources you're working with are closely tied to each other (e.g. each review is tied to both a specific business and a specific user), you'll have to think carefully about how you organize and access them in your database. Some suggestions are included below.
MongoDB:
There are many valid ways to organize data in your database. For example, you could use three separate collections to store businesses, reviews, and photos. In this case, you can either use $lookup aggregation or multiple queries to gather data for a specific business (i.e. for the GET /businesses/{id} endpoint).

Alternatively, you could store all photos and reviews as subdocuments of their corresponding business document. In this case, you'll likely want to use a projection to omit the photo and review data from businesses when returning a list of all businesses (i.e. from the GET /businesses endpoint). You'll also have to think carefully about how you find data for a specific user, e.g. a specific user's photos or reviews. Do do this, you can use subdocument array queries to select businesses with reviews/photos by the specified user, and then you can use some custom JS to select only matching reviews/photos from those businesses. Alternatively, you can use MongoDB's aggregation pipeline to structure a single query to fetch exactly the reviews/photos you're interested in.
-----------------------------------------------------------------------------------------------------------------------------


Connecting the API server to your database
Your API server should read the location (i.e. hostname, port, and database name) and credentials (i.e. username and password) for your database from environment variables.
-----------------------------------------------------------------------------------------------------------------------------
Perform database replication
Implement a database replication scheme for your application. Database replication is the process of maintaining multiple copies of the application's database. Replication can be useful for keeping data safe from failures, avoiding service disruptions, and helping to mitigate high volumes of traffic by distributing it across database replicas. As an application grows, replication becomes increasingly important, and most larger production applications use some form of database replication.

you must set up your application to maintain at least 2 replicas of your database. Both replicas should contain a complete copy of the entire database. For MongoDB, you'll use a Replica Set.
-----------------------------------------------------------------------------------------------------------------------------
Final criteria: 
•	Mongodb runs in a Docker container that is correctly initialized (e.g. by using appropriate environment variables the first time the container is launched).
•	All existing API endpoints in the starter code (in the api/ directory) are modified to use your database.
•	All existing functionality, including pagination, data validation, etc., must be retained.
o	All /businesses endpoints are correctly modified to use the database.
o	All /photos endpoints are correctly modified to use the database.
o	All /reviews endpoints are correctly modified to use the database.
o	All /users endpoints are correctly modified to use the database.
o	Database connection parameters are correctly provided to API server via environment variables.
•	API server must successfully connect to the database.
•	Database replication is successfully implemented:
o	At least 2 database replicas must be maintained, each running in a separate Docker container.
o	Each replica must contain a copy of the entire database.
