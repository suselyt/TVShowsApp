# TVShowsApp

Web application exposing a REST **API** built with **Express** and **Mongoose** to manage TV shows, along with an interface in **HTML** and **JavaScript** (`index.html` y `app.js`). The main server is located in `index.js`.

## Requirements

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)

## Installation

1. Clone this repository and change into the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```

## Database configuration

The server looks for a local MongoDB instance at `mongodb://localhost:27017/tvshows` by default.

1. Make sure the MongoDB service is running:
   ```bash
   mongod
   ```
2. To use a different URL or database, update the connection string in `index.js`.

## Running the app

1. Start the Express server:
   ```bash
   npm run dev
   ```
   The server starts at `http://localhost:3000`.
2. Open `index.html` in your browser (for example, using VSCode's Live Server extension) to interact with the API from the web interface.

## Main endpoints

- `GET /api/shows` – Retrieve all shows.
- `GET /api/show/:id` – Retrieve a show by its ID.
- `POST /api/shows` – Create a show.
- `PUT /api/show/:id` – Update a show.
- `DELETE /api/show/:id` – Delete a show.

## License

Project under ISC license.