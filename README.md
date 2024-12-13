# Simple Blog with Express JS
This is a simple blog API server built using **Node.js**, **Express**, and **EJS**. It supports creating, retrieving, and managing blog articles and categories with Cloudinary integration for image uploads.


##Steps to Run
1. Clone Repo
2. Install Dependency
    `npm install`
3. Run the Application 
    `node --watch index.js`



## Features

- RESTful API for blog articles and categories.
- Dynamic HTML rendering with EJS.
- File upload and storage with Cloudinary.
- Middleware for static file serving and query parameter parsing.
- Modular design with a `content-service` to handle data operations.

---

## Technology Stack

- **Backend**: Node.js with Express.js.
- **View Engine**: EJS.
- **File Storage**: Cloudinary.
- **Middleware**: Multer for file uploads.
- **Environment Configuration**: dotenv.

## API Endpoints

### Home and About

| Method | Endpoint   | Description             |
|--------|------------|-------------------------|
| GET    | `/`        | Redirects to `/about`.  |
| GET    | `/about`   | Renders the "About" page.|

---

### Articles

| Method | Endpoint           | Description                                                                                     |
|--------|--------------------|-------------------------------------------------------------------------------------------------|
| GET    | `/articles`        | Fetches all articles, optionally filtered by `category` or `minDate` query parameters.         |
| GET    | `/article/:id`     | Fetches and displays details of a specific article by its ID.                                  |
| GET    | `/articles/add`    | Renders the "Add Article" page with a list of categories.                                      |
| POST   | `/articles/add`    | Adds a new article with an optional feature image uploaded to Cloudinary.                      |

---

### Categories

| Method | Endpoint      | Description                           |
|--------|---------------|---------------------------------------|
| GET    | `/categories` | Fetches and renders all categories.  |


