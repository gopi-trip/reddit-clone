const { ApolloClient, InMemoryCache } = require("@apollo/client");

const client = new ApolloClient({
  uri: "https://laguaira.stepzen.net/api/piquant-lobster/__graphql",
  headers: {
    Authorization: `APIKey ${process.env.NEXT_PUBLIC_STEPZEN_KEY}`,
    "Content-Type": "application/json",
  },
  cache: new InMemoryCache(),
});

export default client;
