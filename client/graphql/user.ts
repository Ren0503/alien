import { gql } from '@apollo/client';

const userPayload = `
    id
    username
    email
`;

/**
 *  Query 
 */
export const GET_ME = gql`
    query Me {
        me {
            ${userPayload}
        }
    }
`;

/**
 * Mutation
 */

export const ADD_USER = gql`
    mutation AddUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            error {
                fieldName
                message
            }
            user {
                ${userPayload}
            }
        }
    }
`;

export const LOGIN = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
        login(usernameOrEmail: $usernameOrEmail, password: $password) {
            error {
                fieldName
                message
            }
            user {
                ${userPayload}
            }
        }
    }
`;

export const LOGOUT = gql`
    mutation Logout {
        logout
    }
`;

export const FORGOT_PASSWORD = gql`
    mutation ForgetPassword($email: String!) {
        forgetPassword(email: $email)
    }
`;

export const CHANGE_PASSWORD = gql`
    mutation ChangePassword($password: String!, $token: String!) {
        changePassword(password: $password, token: $token) {
            error {
                fieldName
                message
            }
            user {
                ${userPayload}
            }
        }
    }
`;