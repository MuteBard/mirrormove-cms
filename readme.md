# MirrorMove CMS
This project interfaces [mirrormove-crud](https://github.com/MuteBard/mirrormove-crud)

## Requirements
- Node.js v22.8.0

## Summary
The MirrorMove CMS is designed to create and emulate keyboard and mouse actions on the screen. Users can save a series of clicks and keyboard strokes as a single entity, known as an "action". Actions can be created, updated, deleted, and searched within the application.
Furthermore, actions can be grouped together in a "move". A move is capable of containing multiple actions, allowing for sequences of actions to be executed together. Individual actions within a move can also be looped for repetitive tasks. Moves can be created, updated, deleted, and searched within the app.

## Prerequisites

- Ensure that the following dependent services are running for local execution:
    *  [mirrormove-crud](https://github.com/MuteBard/mirrormove-crud) is running at 8080

- Ensure that you create `dev.env` at `./env/dev.env`
```
JWT_STEP_KEY=""
JWT_SECRET_KEY=""
CRUD_HOST="http://localhost"
CRUD_PORT=8080
```


### Listing all actions![Listing all actions](ac-l.png)

### Creating an action![Creating an action](ac-cr.png)

### Listing all moves![Listing all moves](m-l.png)

### Creating a move![Creating a move](m-cr.png)

### Updating a move![Updating a move](m-u.png)

## Running

`npm i`

`npm run dev`


## Video Demo
- Coming Soon
