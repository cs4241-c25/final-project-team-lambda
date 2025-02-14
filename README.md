# LifeLog

The final project for CS4241: Webware taught by Prof. Wilson Wong. Created by AJ Aguiar, Moet O'Donnell, Sam Randa, Charlotte Roscoe, and Ellie Scharpf.

## Development

Run the development server using `npm run dev`. If running for the first time, be sure to run `npm i`.

## Page Structure

This application is divided into two main routes, `(home)` and `(app)`. The pages under `(home)` represent the homepage and user management pages, including `/`, `/login`, and `/register`. In order to navigate to the main app, log in. The pages under `(app)` represent the core app functionality, including `/scrapbooks` and `/profile`. To navigate back to the homepage and user management pages, log out.

## Authentication

Authentication is achieved using NextAuth using the Credentials provider. Server components can access basic user data (such as username) by using the `getSession()` function imported from `@/lib/auth`. Client components can access user data by using the `getSession()` function imported from `next-auth/react`. Importing the right function is important! Once the session has been retrieved, get user info with `session.user`.

## API

Below are the API routes available under `/api`. Routes provided by NextAuth (`/api/auth/*`) are not included.

`/register`
---

Request body:
```
{
    username: string,
    password: string
}
```

Response:
```
2xx response code:
{
    id: string,
    name: string
}

4xx response code:
"error message"
```

Registers a new user using the given username and password. Returns an error code if:
- The user already exists
- The password is less than 8 characters
- The username is less than 3 characters
- The registration fails