import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const rootValue = {
  hello: () => {
    return 'Hello you!';
  },
};

const graphiql = true;

const handler = graphqlHTTP({ schema, rootValue, graphiql });
export default handler;
