# Final Project Back end - Dev Init

this a project in dev init 2 borntodev make by Korarit Saengthong
## Project Stack

This project used `Programming language` **/** `libary` **/** `framework`

- Typescript
- ExpressJS
- Express-session
- Mysql2
- Moment-timezone
- Bcrypt

Database use **`Mysql`** OR **`Mariadb`**

####
auto unit testing used **`Jest` + `Suppertest`**
####
you can use this command to install package for use project
``` 
npm install
```


## Environment (.env) File Config
```
# API PORT
SERVER_PORT=3000

# session secret key
SESSION_SECRET=secret_adafmakaaffafa

# Database Config
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123
DB_NAME=final_borntodev
```

## Database
you can use **`Mysql`** OR **`Mariadb`**  import file final_borntodev.sql to database server

## API Path

- **`POST /users/regiser`** for regiser new user
- **`POST /users/login`** for login
- **`GET /logs`** for get all user log
- **`POST /logs`** for add user log
- **`GET /logs/:id`** for get log by id
- **`PUT /logs/:id`** for update log by id
- **`DELETE /logs/:id`** for delete log by id
- **`GET /todos`** for get all user todos
- **`POST /todos`** for add user todos
- **`GET /todos/:id`** for get todos by id
- **`PUT /todos/:id`** for update todos by id
- **`DELETE /todos/:id`** for delete todos by id
- **`GET /events`** for get all user events
- **`POST /events`** for add user events
- **`GET /events/:id`** for get events by id
- **`PUT /events/:id`** for update events by id
- **`DELETE /events/:id`** for delete events by id
## Example Path Users
**`POST /users/regiser`** This example payload for path
```
{
    "username" : "test0022",
    "email" : "k22@gmail.com",
    "password" : "123456789"
}
```
**`POST /users/login`** This example payload for path
```
{
    "username" : "test0022",
    "password" : "123456789"
}
```

## Example Path Logs
**`POST /logs`** This example payload for path
```
{
    "content":"test test 23"
}
```
**`PUT /logs/:id`** :id paste log id This example payload for path
```
{
    "content":"test test 23"
}
```
**`GET /logs`** not have payload for get all user logs

**`GET /logs/:id`** :id paste log not have payload for get log data by id

**`DELETE /logs/:id`** for delete log by id not have payload

## Example Path Todos
**`POST /todos`** This example payload for path
```
{
    "title":"test 02",
    "description": "test test test",
    "due_date": "2567-05-27",
    "priority": 1,
    "status": true
}
```
**`PUT /todos/:id`** :id paste log id This example payload for path
```
{
    "title":"test 02",
    "description": "test test test",
    "due_date": "2024-05-27",
}
```
**`GET /todos`** not have payload for get all user todos

**`GET /todos/:id`** not have payload for get todo data by id


**`DELETE /todos/:id`** for delete todo by id not have payload



## Example Path Events
**`POST /events`** This example payload for path
```
{
    "title": "test 50",
    "description": "test test",
    "start_date" : "2567-05-22 21:28:55",
    "end_date": "2024-05-30 22:28:55"
}
```
**`PUT /events/:id`** :id paste log id This example payload for path
```
{
    "title": "test 50",
}
```
**`GET /events`** not have payload for get all user events

**`GET /events/:id`** not have payload for get events data by id


**`DELETE /events/:id`** for delete events by id not have payload

## How To Run Test (Step By Step)
1. import file final_borntodev.sql to database server

2. user this command for install package
```
npm install
```

3. use this command for run test
```
npm run dev
```

## How To Run Jest
1. import file final_borntodev.sql to database server

2. user this command for install package
```
npm install
```

3. use this command for auto unit test but you need to fix
you fix id in test case delete logs / todos / events By Id and test case regiser If you don't do it, there will be an error.
```
npm test
```