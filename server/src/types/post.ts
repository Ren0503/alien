import { Error } from './base';
import { Post } from 'src/entity/Post';

export interface QueryGetPostArgs {
    postId: number;
}
export interface QueryGetPostsArgs {
    limit: number;
    cursor: string;
}
export interface MutationCreatePostArgs {
    title: string;
    text: string;
}
export interface MutationUpdatePostArgs {
    id: number;
    title: string;
    text: string;
}
export interface MutationDeletePostArgs {
    id: number;
}
export interface MutationVoteArgs {
    postId: number;
    point: number;
}

export type QueryGetPostsReturn = Promise<{
    posts: Post[];
    hasMore: boolean;
}>;
export type MutationCreatePostReturn = Promise<{
    error?: Error;
    post?: Post;
}>;
