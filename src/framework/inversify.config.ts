import TYPES from './types';

import { Container } from 'inversify';
import { interfaces, TYPE } from 'inversify-express-utils';
import { PostRepositoryImpl } from '../repositories/PostRepository';
import { IPostRepository } from '../repositories/IPostRepository';

const container = new Container();
container.bind<IPostRepository>(TYPES.PostRepositoryImpl).to(PostRepositoryImpl).inSingletonScope();

export default container;