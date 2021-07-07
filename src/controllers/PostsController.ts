import * as express from 'express';
import { interfaces, controller, httpGet, request, response } from "inversify-express-utils";
import { PostRepositoryImpl } from '../repositories/PostRepository';
import TYPES from '../framework/types';
import { inject } from "inversify";
import { IServerResponse } from '../framework/IServerResponse';

@controller("/posts")
export class PostsController implements interfaces.Controller {
    private postRepository: PostRepositoryImpl;
    constructor(@inject(TYPES.PostRepositoryImpl) postRepository: PostRepositoryImpl) {
        this.postRepository = postRepository;
    }

    @httpGet("/")
    public async index(@request() req: express.Request, @response() res: express.Response) {
        try {
            const posts = await this.postRepository.get();
            res.status(200).json({
                message: 'Posts fetched successfull!',
                status: 200,
                data: {
                    posts
                }
            } as IServerResponse);
        } catch (error) {
            res.status(400).json({
                message: error.message,
                status: 400
            } as IServerResponse);
        }
    }

    @httpGet("/:id")
    public async getPostById(@request() req: express.Request, @response() res: express.Response) {
        try {
            const post = await this.postRepository.getOneById(parseInt(req.params.id, 10));
            res.status(200).json({
                message: 'Posts fetched successfull!',
                status: 200,
                data: {
                    post
                }
            } as IServerResponse);
        } catch (error) {
            res.status(400).json({
                message: error.message,
                status: 400
            } as IServerResponse);
        }
    }
}
