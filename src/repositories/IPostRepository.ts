export interface IPostRepository {
    get(): Promise<any>;
    getOneById(id: number): Promise<any>;
}