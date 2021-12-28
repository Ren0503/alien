import 'reflect-metadata';
import express from 'express';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';

import { ApolloServer } from 'apollo-server-express';

import {
    __IS_PRODUCTION__,
    COOKIE_NAME_LOGIN_SESSION,
} from 'src/constants';

import { GraphQLContext } from 'src/context';

import {
    baseSchema,
    postSchema,
    userSchema,
} from 'src/schema';

import {
    userResolvers,
    postResolvers,
} from 'src/resolvers';

import connectToDB from 'src/config/db';

connectToDB()

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
);

// Redis/session setup
const RedisStore = connectRedis(session);
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string),
});

app.use(
    session({
        name: COOKIE_NAME_LOGIN_SESSION,
        store: new RedisStore({ client: redis, disableTouch: true }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
            httpOnly: true,
            sameSite: 'lax',
            secure: __IS_PRODUCTION__,
        },
        secret: process.env.SESSION_SECRET as string,
        resave: false,
    }),
);

// Apollo Server setup
const apolloServer = new ApolloServer({
    typeDefs: [baseSchema, userSchema, postSchema],
    resolvers: [userResolvers, postResolvers],
    context: ({ req, res }): GraphQLContext => ({ req, res, redis }),
});

apolloServer.applyMiddleware({
    app,
    cors: false,
});

app.get('/', (_, res) => {
    res.send('Hello World');
});

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
});