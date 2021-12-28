import { gql } from 'apollo-server-express';

export const userSchema = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        createdAt: String!
        updatedAt: String
    }

    type UserResponse {
        user: User
        error: Error
    }

    extend type Query {
        me: User
    }

    extend type Mutation {
        addUser(username: String!, email: String!, password: String!): UserResponse
        login(usernameOrEmail: String!, password: String!): UserResponse
        logout: Boolean
        forgetPassword(email: String!): Boolean
        changePassword(password: String!, token: String!): UserResponse
    }
`;