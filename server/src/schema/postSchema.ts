import { gql } from 'apollo-server-express';

export const postSchema = gql`
    type Post {
        id: ID!
        title: String!
        text: String!
        textSnippet: String!
        creatorId: ID!
        creator: User!
        points: Int!
        voteStatus: Int!
        createdAt: String!
        updatedAt: String
    }

    type PostResponse {
        post: Post
        error: Error
    }

    type QueryPostsResponse {
        posts: [Post]
        hasMore: Boolean!
    }

    extend type Query {
        post(postId: ID!): Post
        posts(limit: Int!, cursor: String): QueryPostsResponse
    }

    extend type Mutation {
        createPost(title: String!, text: String!): PostResponse
        updatePost(id: ID!, title: String, text: String): Post
        deletePost(id: ID!): Boolean
        upvote(postId: ID!, point: Int!): Post
    }
`;