import Aggregation from "./Aggregation"

/**
 * Aggregation class
 */
export default class Aggregations {

    private aggregations:any = {};
    private totalElements:number;

    /**
     * Constructor
     *
     * @param totalElements
     */
    constructor(totalElements:number) {
        this.totalElements = totalElements;
    }

    /**
     * Add aggregation
     *
     * @param name
     * @param aggregation
     */
    addAggregation(
        name:string,
        aggregation:Aggregation
    ) {
        this.aggregations[name] = aggregation;
    }

    /**
     * Get aggregations
     *
     * @returns {{}}
     */
    getAggregations() :any{
        return this.aggregations;
    }

    /**
     * Get aggregation
     *
     * @param name
     *
     * @returns {Aggregation|null}
     */
    getAggregation(name:string) {
        return this.aggregations[name] instanceof Aggregation
            ? this.aggregations[name]
            : null;
    }

    /**
     * Has not empty aggregation
     *
     * @param name
     *
     * @returns {boolean}
     */
    hasNotEmptyAggregation(name:string) : boolean{
        let aggregation = this.getAggregation(name);
        return (aggregation instanceof Aggregation) &&
            (!aggregation.isEmpty())
    }

    /**
     * Get total elements
     *
     * @return {number}
     */
    getTotalElements() : number {
        return this.totalElements;
    }

    /**
     * To array
     *
     * @return {{total_elements?: number, aggregations?: {}}}
     */
    toArray() : {total_elements?:number, aggregations?:{}} {
        let aggregationCollection = {};
        for (let i in this.aggregations) {
            aggregationCollection[i] = this.aggregations[i].toArray();
        }

        let array:{total_elements?: number, aggregations?: {}} = {};

        if (this.totalElements > 0) {
            array.total_elements = this.totalElements;
        }

        if (Object.keys(aggregationCollection).length > 0) {
            array.aggregations = aggregationCollection;
        }

        return array;
    }

    /**
     * Create from array
     *
     * @param array
     *
     * @return {Aggregations}
     */
    static createFromArray(array:any) {
        let aggregations = new Aggregations(
            typeof array.total_elements === 'number'
                ? array.total_elements
                : 0
        );

        if (typeof array.aggregations === typeof {}) {
            for (let i in array.aggregations) {
                aggregations.addAggregation(
                    i,
                    Aggregation.createFromArray(array.aggregations[i])
                );
            }
        }

        return aggregations;
    }
}