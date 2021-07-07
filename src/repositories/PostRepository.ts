import { injectable } from "inversify";
import axios from "axios";
import config from "config";

import { IPost } from './IPost';
import { IUser } from './IUser';
import { IPostRepository } from './IPostRepository';

@injectable()
export class PostRepositoryImpl implements IPostRepository {
    async get() {
        try {
            const posts = await axios.get(`${config.get('infoBaseUrl')}/posts`);
            const users = await axios.get(`${config.get('infoBaseUrl')}/users`);

            posts.data.forEach((post: IPost) => {
                const currentUser = users.data.find((user: IUser) => {
                    return user.id === post.userId;
                });
                post.user = currentUser;
            });

            return posts.data;
        } catch(error) {
            throw new Error('Unable to load posts from placeholder API!');
        }
    }

    async getOneById( id: number ) {
        try {
            const posts = await axios.get(`${config.get('infoBaseUrl')}/posts`);
            const users = await axios.get(`${config.get('infoBaseUrl')}/users`);
            const currentPost = posts.data.find((post: IPost) => {
                return post.id === id
            });

            if (currentPost) {
                const currentUser = users.data.find((user: IUser) => {
                    return user.id === currentPost.userId
                });
                currentPost.user = currentUser;
                return currentPost;
            }

            throw new Error('No such post found!');
        } catch (error) {
            throw new Error('Unable to load posts from placeholder API!');
        }
    }
}