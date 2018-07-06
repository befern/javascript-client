import Counter from './Counter';
import {
    FILTER_MUST_ALL_WITH_LEVELS,
    FILTER_MUST_ALL, FILTER_AT_LEAST_ONE
} from './../Query/Filter'

/**
 * Aggregation class
 */
export default class Aggregation {

    private name:string;
    private counters:any = {};
    private applicationType:number;
    private totalElements:number;
    private activeElements:any;
    private highestActiveElement:number = 0;

    /**
     * Constructor
     *
     * @param name
     * @param applicationType
     * @param totalElements
     * @param activeElements
     */
    constructor(
        name:string,
        applicationType:number,
        totalElements:number,
        activeElements:any[]
    ) {
        this.name = name;
        this.applicationType = applicationType;
        this.totalElements = totalElements;
        this.activeElements = {};
        for (let i in activeElements) {
            let activeElement = activeElements[i];
            this.activeElements[activeElement] = activeElement;
        }
    }

    /**
     * Add counter
     *
     * @param name
     * @param counter
     */
    addCounter(
        name:string,
        counter:number
    ) {
        if (counter == 0) {
            return;
        }

        let counterInstance = Counter.createByActiveElements(
            name,
            counter,
            Object.keys(this.activeElements)
        );

        if (!(counterInstance instanceof Counter)) {
            return;
        }

        if (
            (this.applicationType & FILTER_MUST_ALL_WITH_LEVELS) &&
            (this.applicationType & ~FILTER_MUST_ALL) &&
            counterInstance.isUsed()
        ) {
            this.activeElements[counterInstance.getId()] = counterInstance;
            this.highestActiveElement = Math.max(
                counterInstance.getLevel(),
                this.highestActiveElement
            );

            return;
        }

        this.counters[counterInstance.getId()] = counterInstance;
    }

    /**
     * Get name
     *
     * @return {string}
     */
    getName() : string{
        return this.name;
    }

    /**
     * Get counter
     *
     * @return {any}
     */
    getCounters() : any{
        return this.counters;
    }

    /**
     * Return if the aggregation belongs to a filter.
     *
     * @return {boolean}
     */
    isFilter() : boolean{
        return (this.applicationType & FILTER_MUST_ALL) > 0;
    }

    /**
     * Aggregation has levels.
     *
     * @return {boolean}
     */
    hasLevels() : boolean {
        return (this.applicationType & FILTER_MUST_ALL_WITH_LEVELS) > 0;
    }

    /**
     * Get counter by name
     *
     * @param name
     *
     * @return {null}
     */
    getCounter(name) : Counter {
        return this.counters[name] instanceof Counter
            ? this.counters[name]
            : null;
    }

    /**
     * Get all elements
     *
     * @return {{}}
     */
    getAllElements() : any {
        return {...this.activeElements, ...this.counters};
    }

    /**
     * Get total elements
     *
     * @return {number}
     */
    getTotalElements():number {
        return this.totalElements;
    }

    /**
     * Get active elements
     *
     * @return {any}
     */
    getActiveElements():any {
        if (Object.keys(this.activeElements).length === 0) {
            return {};
        }

        if (this.applicationType === FILTER_MUST_ALL_WITH_LEVELS) {
            let value:Counter = null;
            for (let i in this.activeElements) {
                let activeElement = this.activeElements[i];
                if (!(activeElement instanceof Counter)) {
                    continue;
                }

                if (value == null) {
                    value = activeElement;
                }

                value = value.getLevel() > activeElement.getLevel()
                    ? value
                    : activeElement;
            }

            return value instanceof Counter
                ? {0: value}
                : null;
        }

        return this.activeElements;
    }

    /**
     * Clean results by level and remove all levels higher than the lowest.
     */
    cleanCountersByLevel() {
        for (let i in this.counters) {
            let counter = this.counters[i];
            if (counter.getLevel() !== this.highestActiveElement + 1) {
                delete this.counters[i];
            }
        }
    }

    /**
     * Is empty
     *
     * @returns {boolean}
     */
    isEmpty():boolean {

        return Object.keys(this.activeElements).length == 0 &&
            Object.keys(this.counters).length == 0;
    }

    toArray() :any{
        let array:any = {
            'name': this.name,
            'counters': [],
            'active_elements': []
        };

        for (let i in this.counters) {
            array.counters.push(this.counters[i].toArray())
        }

        if (this.applicationType !== FILTER_AT_LEAST_ONE) {
            array.application_type = this.applicationType;
        }

        if (this.totalElements > 0) {
            array.total_elements = this.totalElements;
        }

        for (let i in this.activeElements) {
            let activeElement = this.activeElements[i];
            array.active_elements.push(
                activeElement instanceof Counter
                    ? activeElement.toArray()
                    : activeElement
            );
        }

        if (this.highestActiveElement > 0) {
            array.highest_active_level = this.highestActiveElement;
        }

        if (array.counters.length === 0) {
            delete array.counters;
        }

        if (array.active_elements.length === 0) {
            delete array.active_elements;
        }

        return array;
    }

    /**
     * Create from array
     *
     * @param array
     */
    static createFromArray(array:any) : Aggregation {
        let activeElements = [];
        let activeElementsAsArray = array.active_elements;
        activeElementsAsArray = typeof activeElementsAsArray === typeof []
            ? activeElementsAsArray
            : [];

        for (let i in activeElementsAsArray) {
            let activeElementAsArray = activeElementsAsArray[i];
            activeElements.push(
                typeof activeElementAsArray === typeof {}
                    ? Counter.createFromArray(activeElementAsArray)
                    : activeElementAsArray
            );
        }

        let aggregation = new Aggregation(
            array.name,
            parseInt(array.application_type ? array.application_type : FILTER_AT_LEAST_ONE),
            parseInt(array.total_elements ? array.total_elements : 0),
            []
        );
        aggregation.activeElements = activeElements;
        let countersAsArray = typeof array.counters === typeof []
            ? array.counters
            : [];

        for (let i in countersAsArray) {
            let counterAsArray = countersAsArray[i];
            let counter = Counter.createFromArray(counterAsArray);
            aggregation.counters[counter.getId()] = counter;
        }

        aggregation.highestActiveElement = typeof array.highest_active_level === 'number'
            ? array.highest_active_level
            : 0;

        return aggregation;
    }
}