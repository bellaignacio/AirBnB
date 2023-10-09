# SpotSurfing

SpotSurfing is an AirBnB clone where users can add spots to their profile, book other spots, and post ratings and reviews.

**Live Site:** [SpotSurfing](https://airbnb-clone-agql.onrender.com)

**Created By:** [Aurora Ignacio](https://github.com/bellaignacio)

**Technologies Used:** [JavaScript](https://devdocs.io/javascript/) | [PostgreSQL](https://www.postgresql.org/docs/) | [Express](https://expressjs.com/) | [Sequelize](https://sequelize.org/) | [React](https://react.dev/) | [Redux](https://redux.js.org/)

## Design Documentation

* [Backend API Documentation](https://github.com/bellaignacio/airbnb-clone-express/wiki/Backend-Routes)
* [Database Schema](https://github.com/bellaignacio/airbnb-clone-express/wiki/Database-Schema)

## How to build & run the project locally:

 1. Clone this GitHub repository [bellaignacio/airbnb-clone-express](https://github.com/bellaignacio/airbnb-clone-express) onto your local machine.
 2. Create a `.env` file inside the backend directory with the proper settings for your development environment. See the `example.env` file.
 3. Inside the root directory, backend directory, and frontend directory, run the following command to install JavaScript dependencies.
	```
	npm install
	```
 4. Inside the backend directory, run the following command to create and seed the database, and start up the backend server.
	```
    npx dotenv sequelize db:seed:undo:all && npx dotenv sequelize db:migrate:undo:all && npx dotenv sequelize db:migrate && npx dotenv sequelize db:seed:all && npm start
	```
 5. Inside the frontend directory, run the following command to start up the frontend server.
	```
	npm start
	```

## Site In Action

### Dashboard Page
![Dashboard Page](/frontend/public/dashboard.png)

### Spot Page
![Spot Page](/frontend/public/spot.png)

### Review Page
![Review Page](/frontend/public/review.png)

### Spot Settings Page
![Spot Settings Page](/frontend/public/spot-1.png)
![Spot Settings Page](/frontend/public/spot-2.png)
![Spot Settings Page](/frontend/public/spot-3.png)
