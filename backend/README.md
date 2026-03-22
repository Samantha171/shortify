# Shortify Backend

Express.js server for Shortify URL Shortener.

## Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### URLs
- `POST /api/urls`
- `GET /api/urls`
- `GET /api/urls/stats`
- `DELETE /api/urls/:id`

### Analytics
- `GET /api/analytics/:url_id`

### Redirect
- `GET /r/:short_code`
