import { gql } from '@apollo/client';

const postPayload = `
    id
    title
    textSnippet
    points
    voteStatus
    creatorId
    createdAt
    creator {
        username
    }
`;

/**
 * Query
 */
export const GET_POSTS = gql`
    query Posts($limit: Int!, $cursor: String) {
        posts(limit: $limit, cursor: $cursor) {
            posts {
                ${postPayload}
            }
            hasMore
        }
    }
`;

export const GET_POST = gql`
    query Post($postId: ID!) {
        post (postId: $postId) {
            id
            title
            text
            points
            voteStatus
            creatorId
            createdAt
            updatedAt
            creator {
                username
                id
            }
        }
    }
`;

/**
 * Mutation
 */
export const CREATE_POST = gql`
    mutation CreatePost($title: String!, $text: String!) {
        createPost(title: $title, text: $text) {
            error {
                message
            }
            post {
                id
                title
                text
                creatorId
                points
                createdAt
                updatedAt
            }
        }
    }
`;

export const UPDATE_POST = gql`
    mutation UpdatePost($id: ID!, $title: String, $text: String) {
        updatePost(id: $id, title: $title, text: $text) {
            id
            title
            text
            textSnippet
        }
    }
`;

export const DELETE_POST = gql`
    mutation DeletePost($id: ID!) {
        deletePost(id: $id)
    }
`;

export const UP_VOTE = gql`
    mutation Upvote($postId: ID!, $point: Int!) {
        upvote(postId: $postId, point: $point) {
            id
            points
            voteStatus
        }
    }
`;