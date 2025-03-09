# LifeLog

The final project for CS4241: Webware taught by Prof. Wilson Wong. Created by AJ Aguiar, Moet O'Donnell, Sam Randa, Charlotte Roscoe, and Ellie Scharpf.

## Overview

### Description

LifeLog is a scrapbook creation platform where you create your own multi-page scrapbooks with text, shapes, images, and stickers. You start by either registering an account with a username and password or logging in to an existing account. On the profile page, it is also possible to change your display name. Once logged in, you can start creating your scrapbook. When creating a scrapbook, you can set its dimensions, and whether or not the scrapbook should be public or private. 

Once a scrapbook is created, the elements described previously can be added, and you can resize, move, and rotate elements through dragging, or manual inputs. You can upload your own images, or if you do not have any, our program has a list of premade images and stickers available for use by the user. Pages can be saved manually or will automatically save periodically. Additional pages can be added and navigated through with arrow buttons. Once you are happy with your scrapbook, you can export it as a flattened image in .PNG format. Lastly, in the Scrapbooks tab, you can view all of your scrapbooks in one place.

You can try out LifeLog at https://lambda-lifelog.vercel.app/.

### Using LifeLog

To use the app, you must register a new account with a unique username and password. If you prefer to use a premade account, log in using the following credentials.
```
Username: sam
Password: password
```

### Technologies

React was used for element reactivity. It powered the scrapbook editor, scrapbook browser, and form submission actions. Built on top of React, Next.js was used for page routing and API routes. The App Router allowed us to make each page into its own folder, rendering different React components as the user navigated the application. Additionally, API routes acted as a midpoint between the frontend components and database functions, performing authentication and data validation. NextAuth was used for authentication, allowing us to track session information. To store user and scrapbook data, we took advantage of MongoDB’s flexible document model to create a 1-to-1 mapping between frontend scrapbook manipulation and backend storage. To facilitate uploading images, we used Imagekit for image storage and retrieval. In our scrapbook, we simply rendered images using the image links provided.

### Challenges

Integrating features and each other’s work was a bit of a challenge since we had to ensure that components like the toolbox, canvas, login, and other elements worked together smoothly without conflicts. Keeping the selected elements updated in both the canvas and the toolbox in real time was a bit tricky, as was deleting elements dynamically without disrupting the UI. Scrapbook updates proved to be difficult as well; since React is built upon immutable objects, we were required to recreate the scrapbook object every time we wanted to update an element. Luckily, libraries like Immer make this process easier.

### Team Roles

- AJ: Made the profile page, along with backend routing having to do with updating the information so it can be accessed later
- Charlotte: Data Modeling assistance, Dynamic Page Routing for scrapbooks, Scrapbook creation page, integration work, Image Upload, Premade Stickers Component
- Ellie: Design and styling of the pages, scrapbook deletion
- Moet: Toolbox (text, shapes, position, sizing, color selection, fonts, font size), dragging and resizing elements, deleting elements off canvas, exporting scrapbook as an image, locking/unlocking elements
- Sam: Project setup, authentication, feature integration, data modeling, scrapbook viewing, scrapbook navigation, scrapbook saving

### Demo Video

A demo of our application can be found at https://1drv.ms/v/c/5883912109d08702/EXEkWIFATHRFh86QW3CwrX8B76Y5SefACh_sblxp7iPUgw?e=83lDBc.

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

Type: `POST`

Request body:
```typescript
{
    username: string,
    password: string
}
```

Response:
```typescript
// 2xx response code:
{
    id: string,
    name: string
}

// 4xx response code:
"error message"
```

Registers a new user using the given username and password. Returns an error code if:
- The user already exists
- The password is less than 8 characters
- The username is less than 3 characters
- The registration fails

`/scrapbooks/create`
---

Type: `POST`

Request body:
```
[none]
```

Response:
```typescript
// 2xx response code:
{ ...IScrapbook }

// 4xx response code:
"error message"
```

Creates a new scrapbook owned by an authenticated user, returning the newly created scrapbook. Requires authentication.

`/scrapbooks/get/[scrapbookID]`
---

Type: `GET`

Request body:
```
[none]
```

Response:
```typescript
// 2xx response code:
{ ...IScrapbook }

// 4xx response code:
"error message"
```

Gets an individual scrapbook from the database. Returns an error if the scrapbook doesn't exist, or if the scrapbook is private and the user is not authenticated or does not match the scrapbook owner.

`/scrapbooks/save`
---

Type: `POST`

Request body:
```typescript
{ ...IScrapbook }
```

Response:
```typescript
// 2xx response code:
{ ...IScrapbook }

// 4xx response code:
"error message"
```

Updates a scrapbook in the database. Returns an error if the user is not authenticated does not match the owner of the scrapbook.

`/scrapbooks/delete`
---

Type: `DELETE`

Request body:
```typescript
{ scrapbookID: string }
```

Response:
```typescript
// 2xx response code:
"Scrapbook deleted successfully"

// 4xx response code:
"error message"
```

Deletes a scrapbook in the database.

## Data Model

Below are the data structures used to store information in the database.

`User`
---

```typescript
interface IUser {
    _id: string
    username: string
    password: string
}
```

The `User` model stores basic information about a user, including a randomized id, username, and a hashed and salted password.

`Scrapbook`
---
```typescript
interface IScrapbook {
    _id: string,
    owner: string, // user id
    title: string,
    visibility: "public" | "private",
    pages: Page[],
    likes: string[]
}

interface Page {
    number: number,
    elements: Element[]
}
```

The `Scrapbook` model stores scrapbook metadata as well as a list of its pages. Each page has a number and a list of elements, including images, text, and shapes. The order of `elements` determines the order in which they are layered, with `Element`s later in the list appearing on top of those earlier in the list.

`Element`
---
```typescript
type Element = Image | Text | Rectangle | Circle

interface Image {
    type: "image",
    position: {
        x: number,
        y: number
    },
    size: {
        x: number,
        y: number
    },
    rotation: number,
    url: string
}

interface Text {
    type: "text",
    position: {
        x: number,
        y: number
    },
    size: {
        x: number,
        y: number,
    },
    content: string,
    font_size: number,
    color: string,
    rotation: number,
    font: string
}

interface Rectangle {
    type: "rectangle",
    position: {
        x: number,
        y: number
    },
    size: {
        x: number,
        y: number,
    },
    rotation: number,
    color: string
}

interface Circle {
    type: "circle",
    position: {
        x: number,
        y: number
    },
    size: number,
    color: string
}
```

The `Element` model stores information for a single element in the scrapbook. This includes:
- An image, with a position, scale, rotation, and url
- A block of text, with a position, bounding box size, rotation, text content, font size, color, and font style
- A rectangle, with a position, size, rotation, and color
- A circle, with a position, size (radius), and color

Each element type has a `type` parameter used to differentiate them when processing.

`Sticker`
---
```typescript

interface ISticker {
    url: string, 
    width: number,
    height: number,
}
```

The `Sticker` model stores information for a single sticker available for users to import into their scrapbook. It includes:
- The imagekit `URL` referencing the sticker
- The image `width` in pixels
- the image `height` in pixels