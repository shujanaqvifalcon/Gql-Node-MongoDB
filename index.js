/**
 * Pursue Node-JS 
 * @author shuja naqvi
 */
//GETTING ENV VALUES
require('dotenv').config();
//CREATING Apollo server
const { ApolloServer }  = require('apollo-server');
//Getting port from env
const port = process.env.PORT || 5000;
//Setting Mode 
const NODE_MODE =  'dev';
//connecting DB
require('./database');
//importing graphql typeDefs
const typeDefs = require('./graphql/typeDefs');
//importing graphql resolvers
const resolvers = require('./graphql/resolvers');
//creating Apolloeserver and sending typeDefs and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers
});

//Running app on apollo server :)
server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running in ${NODE_MODE} mode on port  BOOM :)` + port);
  });

