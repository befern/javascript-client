import Item from "../Model/Item";
import ItemUUID from "../Model/ItemUUID";
import Changes from "../Model/Changes";
import Query from "../Query/Query";
import ImmutableConfig from "../Config/ImmutableConfig";
import Config from "../Config/Config";
import Result from "../Result/Result";

/**
 * Aggregation class
 */
export default abstract class Repository {

    protected itemsToUpdate:Item[] = [];
    protected itemsToDelete:ItemUUID[] = [];
    protected appId:string;
    protected indexId:string;
    protected token:string;

    /**
     * Constructor
     *
     * @param appId
     * @param indexId
     * @param token
     */
    constructor(
        appId:string,
        indexId:string,
        token:string
    ) {
        this.appId = appId;
        this.indexId = indexId;
        this.token = token;
    }

    /**
     * Reset cached elements
     */
    private resetCachedElements() {
        this.itemsToUpdate = [];
        this.itemsToDelete = [];
    }

    /**
     * Add element
     *
     * @param item
     */
    addItem(item:Item) {
        this.itemsToUpdate.push(item);
    }

    /**
     * Add elements
     *
     * @param items
     */
    addItems(items:Item[]) {
        for (let i in items) {
            this.addItem(items[i]);
        }
    }

    /**
     * Delete item
     *
     * @param itemUUID
     */
    deleteItem(itemUUID:ItemUUID) {
        this.itemsToDelete.push(itemUUID);
    }

    /**
     * Delete items
     *
     * @param itemsUUID
     */
    deleteItems(itemsUUID:ItemUUID[]) {
        for (let i in itemsUUID) {
            this.deleteItem(itemsUUID[i]);
        }
    }

    /**
     * flush
     *
     * @param bulkNumber
     * @param skipIfLess
     *
     * @return {Promise<void>}
     */
    async flush(
        bulkNumber:number = 500,
        skipIfLess:boolean = false
    ): Promise<void> {
        if (
            skipIfLess &&
            this.itemsToUpdate.length < bulkNumber
        ) {
            return new Promise<void> (
                resolve => resolve()
            );
        }

        let offset = 0;
        try {
            while (true) {
                let items = this
                    .itemsToUpdate
                    .slice(
                        offset,
                        offset + bulkNumber
                    );

                if (items.length === 0) {
                    break;
                }

                await this.flushItems(items, []);
                offset += bulkNumber;
            }

            await this.flushItems([], this.itemsToDelete);
        } catch (error) {
            this.resetCachedElements();
            throw error;
        }

        this.resetCachedElements();

        return new Promise<void> (
            resolve => resolve()
        );
    }

    /**
     * flush items
     *
     * @param itemsToUpdate
     * @param itemsToDelete
     */
    abstract flushItems(
        itemsToUpdate:Item[],
        itemsToDelete:ItemUUID[]
    );

    /**
     * Query
     *
     * @param query
     *
     * @return {Promise<Result>}
     */
    abstract async query(query:Query): Promise<Result>;

    /**
     * Update items
     *
     * @param query
     * @param changes
     *
     * @return {Promise<void>}
     */
    abstract async updateItems(
        query:Query,
        changes:Changes
    ): Promise<void>;

    /**
     * Create index
     *
     * @param immutableConfig
     *
     * @return {Promise<void>}
     */
    abstract async createIndex(immutableConfig:ImmutableConfig): Promise<void>;

    /**
     * Delete index
     *
     * @return {Promise<void>}
     */
    abstract async deleteIndex(): Promise<void>;

    /**
     * Reset index
     *
     * @return {Promise<void>}
     */
    abstract async resetIndex(): Promise<void>;

    /**
     * Check index
     *
     * @return {Promise<boolean>}
     */
    abstract async checkIndex(): Promise<boolean>;

    /**
     * Configure index
     *
     * @param config
     *
     * @return {Promise<void>}
     */
    abstract async configureIndex(config:Config): Promise<void>;
}