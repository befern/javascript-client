import Item from "../Model/Item";
import ItemUUID from "../Model/ItemUUID";
import Changes from "../Model/Changes";
import Query from "../Query/Query";
import Result from "../Result/Result";
import ImmutableConfig from "../Config/ImmutableConfig";
import Config from "../Config/Config";
import HttpClient from "../Http/HttpClient";
import Repository from "./Repository";
import ResourceNotAvailableError from "../Error/ResourceNotAvailableError";
import InvalidTokenError from "../Error/InvalidTokenError";
import ResourceExistsError from "../Error/ResourceExistsError";
import InvalidFormatError from "../Error/InvalidFormatError";
import ConnectionError from "../Error/ConnectionError";
import Response from "../Http/Response";
/**
 * Aggregation class
 */
export default class HttpRepository extends Repository {

    private httpClient:HttpClient;

    /**
     * Constructor
     *
     * @param httpClient
     * @param appId
     * @param indexId
     * @param token
     */
    constructor(
        httpClient:HttpClient,
        appId:string,
        indexId:string,
        token:string
    ) {
        super(appId, indexId, token);
        this.httpClient = httpClient;
    }

    /**
     * flush items
     *
     * @param itemsToUpdate
     * @param itemsToDelete
     *
     * @Returns {Promise<void>}
     */
    async flushItems(
        itemsToUpdate:Item[],
        itemsToDelete:ItemUUID[]
    ) : Promise<void> {

        await Promise.all([
            await this.flushUpdateItems(itemsToUpdate),
            await this.flushDeleteItems(itemsToDelete)
        ]).then(_ => {
            return;
        });

        return new Promise<void>(
            resolve => resolve()
        );
    }

    /**
     * Flush update items
     *
     * @param itemsToUpdate
     *
     * @return {Promise<void>}
     */
    async flushUpdateItems(itemsToUpdate:Item[]) : Promise<void> {

        return await (itemsToUpdate.length > 0)
            ? this
                .httpClient
                .get(
                    '/items',
                    'post',
                    this.getQueryValues(),
                    {
                        'items': itemsToUpdate.map(item => {
                            return item.toArray()
                        }),
                    }
                )
                .then(response => {
                    HttpRepository.throwTransportableExceptionIfNeeded(response);
                })
            : new Promise<void>(
                resolve => resolve()
            );
    }

    /**
     * Flush delete items
     *
     * @param itemsToDelete
     *
     * @return {Promise<void>}
     */
    async flushDeleteItems(itemsToDelete:ItemUUID[]) : Promise<void> {

        return await (itemsToDelete.length > 0)
            ? this
                .httpClient
                .get(
                    '/items',
                    'delete',
                    this.getQueryValues(),
                    {
                        'items': itemsToDelete.map(itemUUID => {
                            return itemUUID.toArray()
                        }),
                    }
                )
                .then(response => {
                    HttpRepository.throwTransportableExceptionIfNeeded(response);
                })
            : new Promise<void>(
                resolve => resolve()
            );
    }

    /**
     * Query
     *
     * @param query
     *
     * @return {Promise<Result>}
     */
    async query(query:Query): Promise<Result> {

        return await this
            .httpClient
            .get(
                '/',
                'get',
                this.getQueryValues(),
                {
                    'query': query.toArray()
                }
            ).then(response => {
                HttpRepository.throwTransportableExceptionIfNeeded(response);

                return Result.createFromArray(response.getBody());
            });
    }

    /**
     * Update items
     *
     * @param query
     * @param changes
     *
     * @return {Promise<void>}
     */
    async updateItems(
        query:Query,
        changes:Changes
    ): Promise<void> {
        return await this
            .httpClient
            .get(
                '/items',
                'put',
                this.getQueryValues(),
                {
                    'query': query.toArray(),
                    'changes': changes.toArray()
                }
            ).then(response => {
                HttpRepository.throwTransportableExceptionIfNeeded(response);

                return;
            });
    }

    /**
     * Create index
     *
     * @param immutableConfig
     *
     * @return {Promise<void>}
     */
    async createIndex(immutableConfig:ImmutableConfig): Promise<void> {

        return await this
            .httpClient
            .get(
                '/index',
                'post',
                this.getQueryValues(),
                {
                    'config': immutableConfig.toArray()
                }
            ).then(response => {
                HttpRepository.throwTransportableExceptionIfNeeded(response);

                return;
            });
    }

    /**
     * Delete index
     *
     * @return {Promise<void>}
     */
    async deleteIndex(): Promise<void> {

        return await this
            .httpClient
            .get(
                '/index',
                'delete',
                this.getQueryValues()
            ).then(response => {
                HttpRepository.throwTransportableExceptionIfNeeded(response);

                return;
            });
    }

    /**
     * Reset index
     *
     * @return {Promise<void>}
     */
    async resetIndex(): Promise<void> {

        return await this
            .httpClient
            .get(
                '/index/reset',
                'post',
                this.getQueryValues()
            ).then(response => {
                HttpRepository.throwTransportableExceptionIfNeeded(response);

                return;
            });
    }

    /**
     * Check index
     *
     * @return {Promise<boolean>}
     */
    async checkIndex(): Promise<boolean> {

        return await this
            .httpClient
            .get(
                '/index',
                'head',
                this.getQueryValues()
            ).then(response => {
                HttpRepository.throwTransportableExceptionIfNeeded(response);

                return response.getCode() === 200;
            });
    }

    /**
     * Configure index
     *
     * @param config
     *
     * @return {Promise<void>}
     */
    async configureIndex(config:Config) : Promise<void> {

        return await this
            .httpClient
            .get(
                '/index/config',
                'post',
                this.getQueryValues(),
                {
                    'config': config.toArray()
                }
            ).then(response => {
                HttpRepository.throwTransportableExceptionIfNeeded(response);

                return;
            });
    }

    /**
     * Get query values
     *
     * @returns any
     */
    private getQueryValues():any {
        return {
            'app_id': this.appId,
            'index': this.indexId,
            'token': this.token,
        };
    }

    /**
     * throw error if needed
     *
     * @param response
     */
    static throwTransportableExceptionIfNeeded(response:Response) {

        if (typeof response.getCode() == 'undefined') {
            return;
        }

        switch (response.getCode()) {
            case ResourceNotAvailableError.getTransportableHTTPError():
                throw new ResourceNotAvailableError(response.getBody().message);
            case InvalidTokenError.getTransportableHTTPError():
                throw new InvalidTokenError(response.getBody().message);
            case InvalidFormatError.getTransportableHTTPError():
                throw new InvalidFormatError(response.getBody().message);
            case ResourceExistsError.getTransportableHTTPError():
                throw new ResourceExistsError(response.getBody().message);
            case ConnectionError.getTransportableHTTPError():
                throw new ConnectionError(response.getBody().message);
        }
    }
}