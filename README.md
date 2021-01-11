# Tags Backend

## Description

Tag application endpoint, made in graphql with NestJs.
You can check the [Documentation](http://159.203.88.25:8080/overview.html).
<br/><br/>
[Frontend Code.](https://github.com/davp00/tags-frontend)

## Live Preview
You can see 
a live preview in [Backend EndPoint](http://159.203.88.25:3000/graphql).

## Environment
<strong>Note: to run 
the tests it is necessary to create the file ".env.test" 
with the same variables and different values (recommended), 
for correct operation.</strong>
```dotenv
NODE_ENV=development
PORT=3000
MONGO_DB_URI=mongodb://your-host/your-db
```
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test
[Coverage Report](http://159.203.88.25:8081/)
```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Initialize Tags
You can initialize a defined number of tags with the InsertTags mutation
```graphql
mutation InsertTags($nTags: Int!){
  insertTags(nTags: $nTags)
}
```

## Stay in touch

- Author - [Daniel Viloria](https://github.com/davp00)
- LinkedIn - [https://www.linkedin.com/in/daniel-viloria-perez-17434016b/](https://www.linkedin.com/in/daniel-viloria-perez-17434016b/)
