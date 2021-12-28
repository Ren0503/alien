import { GraphQLContext } from 'src/context';

export default ({ req }: GraphQLContext) => {
    if (!req.session.userId) {
        throw new Error('NotAuthenticated');
    }
}