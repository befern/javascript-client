import Aggregations from "./Aggregations";
import Query from "../Query/Query";
import Item from "../Model/Item";
import Aggregation from "../Query/Aggregation";
/**
 * Result class
 */
export default class Result {

    private query:Query;
    private items:Item[] = [];
    private suggests:string[] = [];
    private aggregations:Aggregations;
    private totalItems:number;
    private totalHits:number;
    private itemsGroupedByTypeCache:any;

    /**
     * Constructor
     *
     * @param query
     * @param totalItems
     * @param totalHits
     */
    constructor(
        query:Query,
        totalItems:number,
        totalHits:number
    ) {
        this.query = query;
        this.totalItems = totalItems;
        this.totalHits = totalHits;
    }

    /**
     * Create
     *
     * @param query
     * @param totalItems
     * @param totalHits
     * @param aggregations
     * @param suggests
     * @param items
     *
     * @returns {Result}
     */
    static create(
        query:Query,
        totalItems:number,
        totalHits:number,
        aggregations:Aggregations,
        suggests:string[],
        items:Item[]
    ) : Result {
        let result = new Result(
            query,
            totalItems,
            totalHits
        );

        result.aggregations = aggregations;
        result.suggests = suggests;
        result.items = items;

        return result;
    }

    /**
     * Add item
     *
     * @param item
     */
    addItem(item:Item) {
        this.items.push(item);
    }

    /**
     * Get items
     *
     * @return {Item[]}
     */
    getItems():Item[] {
        return this.items;
    }

    /**
     * Get items grouped by types
     *
     * @return {any[]}
     */
    getItemsGroupedByTypes() : any[] {
        if(
            this.itemsGroupedByTypeCache instanceof Object &&
            Object.keys(this.itemsGroupedByTypeCache).length > 0
        ) {
            return this.itemsGroupedByTypeCache;
        }

        let itemsGroupedByTypes:any = {};
        for (let i in this.items) {
            let item = this.items[i];
            if (!(itemsGroupedByTypes[item.getType()] instanceof Array)) {
                itemsGroupedByTypes[item.getType()] = [];
            }

            itemsGroupedByTypes[item.getType()].push(item);
        }

        this.itemsGroupedByTypeCache = itemsGroupedByTypes;

        return itemsGroupedByTypes;
    }

    /**
     * Get items by type
     *
     * @param type
     *
     * @return {Array}
     */
    getItemsByType(type:string) : Item[] {
        let itemsGroupedByTypes = this.getItemsGroupedByTypes();
        return itemsGroupedByTypes[type] == null
            ? []
            : itemsGroupedByTypes[type];
    }

    /**
     * Get items by types
     *
     * @param types
     */
    getItemsByTypes(types:string[]) : Item[] {
        return this.items.filter(item => types.indexOf(item.getType()) >= 0);
    }

    /**
     * Get first item
     *
     * @return {Item}
     */
    getFirstItem() {
        return this.items.length > 0
            ? this.items[0]
            : null;
    }

    /**
     * Set aggregations
     *
     * @param aggregations
     */
    setAggregations(aggregations:Aggregations) {
        this.aggregations = aggregations;
    }

    /**
     * Get aggregations
     *
     * @return {Aggregations}
     */
    getAggregations() : Aggregations {
        return this.aggregations instanceof Aggregations
            ? this.aggregations
            : null;
    }

    /**
     * Get aggregation
     *
     * @param name
     *
     * @return {null}
     */
    getAggregation(name:string) : Aggregation {

        return this.aggregations == null
            ? null
            : this.aggregations.getAggregation(name);
    }

    /**
     * Has no empty aggregation
     *
     * @param name
     *
     * @return {boolean}
     */
    hasNotEmptyAggregation(name:string) : boolean {

        return this.aggregations == null
            ? false
            : this.aggregations.hasNotEmptyAggregation(name)
    }

    /**
     * Add suggest
     *
     * @param suggest
     */
    addSuggest(suggest:string) {
        this.suggests.push(suggest);
    }

    /**
     * Get suggests
     *
     * @return {string[]}
     */
    getSuggests() : string[] {
        return this.suggests;
    }

    /**
     * Get query
     *
     * @return {Query}
     */
    getQuery() : Query {
        return this.query;
    }

    /**
     * Get total elements
     *
     * @return {number}
     */
    getTotalItems() : number {
        return this.totalItems;
    }

    /**
     * Get total hits
     *
     * @return {number}
     */
    getTotalHits() : number {
        return this.totalHits;
    }

    /**
     * to array
     *
     * @return {{query: any, total_items: number, total_hits: number, items:any[], aggregations: any, suggests: string[]}}
     */
    toArray() : any {
        return {
            'query': this.query.toArray(),
            'total_items': this.totalItems,
            'total_hits': this.totalHits,
            'items': this.items.map(item => item.toArray()),
            'aggregations': this.aggregations == null
                ? null
                : this.aggregations.toArray(),
            'suggests': this.suggests
        };
    }

    /**
     * Create from array
     *
     * @param array
     *
     * @return {Result}
     */
    static createFromArray(array:any): Result {
        return Result.create(
            Query.createFromArray(array.query),
            array.total_items
                ? array.total_items
                : 0,
            array.total_hits
                ? array.total_hits
                : 0,
            array.aggregations instanceof Object
                ? Aggregations.createFromArray(array.aggregations)
                : null,
            array.suggests
                ? array.suggests
                : null,
            array.items instanceof Array
                ? array.items.map(itemAsArray => Item.createFromArray(itemAsArray))
                : []
        );
    }
}