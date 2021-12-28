import { gql } from 'apollo-server-express';

export const baseSchema = gql`
    type Query
    type Mutation

    type Error {
        fieldName: String
        message: String!
    }
`;
