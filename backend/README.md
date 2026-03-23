# Shortify Backend

An Express.js REST API for managing URL shortening, authentication, and analytics.

##  Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   Copy `.env.example` to `.env` and fill in your details:
   ```bash
   cp .env.example .env
   ```

3. **Initialize Database**:
   Ensure PostgreSQL is running and initialize the schema:
   ```bash
   psql -d shortify -f schema.sql
   ```

4. **Run the server**:
   ```bash
   # Development mode with hot-reload
   npm run dev

   # Production mode
   npm start
   ```

##  API Endpoints

###  Authentication (`/api/auth`)
- `POST /signup`: Register a new account.
- `POST /login`: Log in to an existing account.
- `GET /me`: Retrieve the current authenticated user's profile.

###  URL Management (`/api/urls`)
- `POST /`: Shorten a new URL (supports custom aliases and expiry).
- `GET /`: List all URLs created by the user.
- `GET /stats`: Get overall stats for the user's URLs.
- `DELETE /:id`: Delete a specific URL.

###  Analytics (`/api/analytics`)
- `GET /:url_id`: Get detailed click history for a URL.

###  Redirection (`/r`)
- `GET /:short_code`: Redirects to the original URL and tracks the visit.

##  Built With
- **Express.js**: Web framework.
- **pg**: PostgreSQL client.
- **bcryptjs**: Password hashing.
- **jsonwebtoken (JWT)**: Authentication.
- **nanoid**: Unique ID generation.
- **multer & csv-parse**: Bulk upload processing.
