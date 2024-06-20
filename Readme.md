# for start application

-- docker-compose -f docker-compose.yml up --build -d

- http://localhost:4000 you will get the graphql sandbox

# api information

Except login, user create, organization create and list get all other queries are protected.

so follow the steps

- create Organization
- create user using organization id
- login user
- use token in header Authorization
