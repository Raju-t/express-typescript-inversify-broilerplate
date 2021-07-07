import "reflect-metadata";
import supertest from "supertest";
import * as sinon from "ts-sinon";
import { IPostRepository } from "../repositories/IPostRepository";
import { PostsController } from "./PostsController";
import app from '../';
import { InversifyExpressServer, interfaces, TYPE } from "inversify-express-utils";
import container from "../framework/inversify.config";
import TYPES from '../framework/types';
import { injectable } from "inversify";
import { expect } from "chai";
import MockPost from "../mocks/Post";

describe('The PostsController', () => {
        beforeEach((done) => {
            container.unbindAll();
            const repo: any = {
                get: () => {
                    return [
                        MockPost
                    ];
                },
                getOneById: () => {
                    return MockPost;
                }
            }
            container.bind<IPostRepository>(TYPES.PostRepositoryImpl).toConstantValue(repo);
            done();
        });

        it('Return list of posts', async () => {
            const server = new InversifyExpressServer(container, null, { rootPath: "/api/v1" }, app);
            const appConfigured = server.build();

            const result = await supertest(appConfigured).get('/api/v1/posts');
            expect(result.status).to.equals(200);
        });

        it('Return single post detail', async () => {
            const server = new InversifyExpressServer(container, null, { rootPath: "/api/v1" }, app);
            const appConfigured = server.build();

            const result = await supertest(appConfigured).get('/api/v1/posts/1');
            expect(result.status).to.equals(200);
        });
});