const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {schema, resolver} = require('./api/schema');
const envs = require('./envs');

const app = express();
app.use(express.json());

app.use(express.json())

app.use(
    envs.graphqlPath,
    graphqlHTTP((request, response, getGraphQLParams) => ({
        schema,
        rootValue: resolver,
        graphiql: true,
        context: {
            request,
            response
        }
    }))
);

app.listen(envs.port, () => {
  console.log(`Server is running at https://localhost:${envs.port} ${envs.graphqlPath}`);
})
