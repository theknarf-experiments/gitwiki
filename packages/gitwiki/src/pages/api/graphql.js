import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
	type History {
		hash: String
		author: String
		date: String
		message: String
	}

  type Query {
    hello: String
		history: [History]
  }
`);

const rootValue = {
  hello: () => {
    return 'Hello you!';
  },
	history: () => {
		return [
			{ hash: '2560b27', author: 'John Doe', message: 'Did some stuff' },
			{ hash: '2560b27', author: 'Ola Nordman', message: 'Did some stuff' },
			{ hash: 'fb0edeb', author: 'John Deer', message: 'Did some stuff' },
		];
}
};

const graphiql = true;

const handler = graphqlHTTP({ schema, rootValue, graphiql });
export default handler;
