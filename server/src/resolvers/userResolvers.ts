import { IResolvers } from 'apollo-server-express';
import { User } from 'src/entity/User';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import sendEmail from 'src/utils/sendEmail';
import { validateEmail } from 'src/utils/validator';

import {
    COOKIE_NAME_LOGIN_SESSION,
    FORGET_PASSWORD_PREFIX,
} from 'src/constants'

import { GraphQLContext } from 'src/context';

import {
    MutationAddUserArgs,
    MutationAddUserReturn,
    MutationLoginArgs,
    MutationLoginReturn,
    MutationForgetPasswordArgs,
    MutationChangePasswordArgs,
    MutationChangePasswordReturn,
    QueryMeReturn,
} from 'src/types'

export const userResolvers: IResolvers = {
    Query: {
        async me(_, __, { req }: GraphQLContext): QueryMeReturn {
            if (!req.session.userId) {
                return null;
            }
            return User.findOne({ id: req.session.userId });
        },
    },
    Mutation: {
        async addUser(
            _,
            { username, email, password }: MutationAddUserArgs,
            context: GraphQLContext,
        ): MutationAddUserReturn {
            let theUser = await User.findOne({ where: { username } });
            if (theUser) {
                return {
                    error: { fieldName: 'username', message: 'Username already exists' },
                };
            }
            theUser = await User.findOne({ where: { email } });
            if (theUser) {
                return {
                    error: { fieldName: 'email', message: 'Email already exists' },
                };
            }
            let newUser = new User();
            newUser.username = username;
            newUser.email = email;
            newUser.password = await bcrypt.hash(password, 10);
            newUser = await User.save(newUser);

            context.req.session.userId = newUser.id;

            return { user: newUser };
        },

        async login(_, { usernameOrEmail, password }: MutationLoginArgs, context: GraphQLContext): MutationLoginReturn {
            const theUser = await User.findOne({
                where: validateEmail(usernameOrEmail) ? { email: usernameOrEmail } : { username: usernameOrEmail },
            });
            if (!theUser) {
                return {
                    error: { fieldName: 'usernameOrEmail', message: 'Username/Email does not exist' },
                };
            }

            const isPasswordValid = await bcrypt.compare(password, theUser.password);
            if (!isPasswordValid) {
                return {
                    error: { fieldName: 'password', message: 'Password is not correct.' },
                };
            }

            context.req.session.userId = theUser.id;

            return { user: theUser };
        },

        async logout(_, __, { req, res }: GraphQLContext): Promise<boolean> {
            return new Promise((resolve) => {
                req.session.destroy((err) => {
                    if (err) {
                        console.log(err);
                        return resolve(false);
                    }

                    res.clearCookie(COOKIE_NAME_LOGIN_SESSION);
                    return resolve(true);
                });
            });
        },

        async forgetPassword(_, { email }: MutationForgetPasswordArgs, { redis }: GraphQLContext): Promise<boolean> {
            const theUser = await User.findOne({ where: { email } });
            if (!theUser) {
                return true;
            }

            const token = v4();
            await redis.set(FORGET_PASSWORD_PREFIX + token, theUser.id, 'ex', 1000 * 60 * 60 * 24 * 3); // 3 days

            await sendEmail({
                to: email,
                html: `<a href="http://localhost:3000/change-password/${token}">reset password</a>`,
            });

            return true;
        },

        async changePassword(
            _,
            { password, token }: MutationChangePasswordArgs,
            { req, redis }: GraphQLContext,
        ): MutationChangePasswordReturn {
            const userId = await redis.get(FORGET_PASSWORD_PREFIX + token);
            if (!userId) {
                return {
                    error: { fieldName: 'token', message: 'Token is expired' },
                };
            }
            const theUser = await User.findOne({ where: { id: userId } });
            if (!theUser) {
                return {
                    error: { fieldName: 'token', message: 'User does not exist' },
                };
            }
            theUser.password = await bcrypt.hash(password, 10);
            await User.save(theUser);

            req.session.userId = theUser.id;

            await redis.del(FORGET_PASSWORD_PREFIX + token);

            return { user: theUser };
        },
    },
}