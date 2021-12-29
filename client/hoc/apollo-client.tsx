import { NextPageContext } from 'next';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import withApollo from 'utils/withApollo';

const apolloClient = (ctx?: NextPageContext) =>
    new ApolloClient({
        uri: 'http://localhost:4000/graphql',
        headers: {
            cookie: ctx?.req?.headers.cookie || '',
        },
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        posts: {
                            keyArgs: [],
                            merge(
                                existing: QueryPostsResponse | undefined,
                                incoming: QueryPostsResponse
                            ): QueryPostsResponse {
                                return {
                                    ...incoming,
                                    posts: [
                                        ...(existing?.posts || []),
                                        ...(incoming.posts || []),
                                    ],
                                };
                            },
                        },
                    },
                },
            },
        }),
        credentials: 'include',
    });

export default withApollo(apolloClient);
