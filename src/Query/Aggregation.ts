import {
    FILTER_AT_LEAST_ONE,
    FILTER_TYPE_FIELD
} from "./Filter"

/**
 * Aggregation constants
 */
export const AGGREGATION_SORT_BY_COUNT_ASC = ['_count', 'asc'];
export const AGGREGATION_SORT_BY_COUNT_DESC = ['_count', 'desc'];
export const AGGREGATION_SORT_BY_NAME_ASC = ['_term', 'asc'];
export const AGGREGATION_SORT_BY_NAME_DESC = ['_term', 'desc'];
export const AGGREGATION_NO_LIMIT = 0;


/**
 * Aggregation class
 */
export default class Aggregation {

    private name: string;
    private field: string;
    private applicationType: number;
    private filterType: string;
    private subgroup: string[] = [];
    private sort: string[];
    private limit: number;

    /**
     * Construct
     *
     * @param name
     * @param field
     * @param applicationType
     * @param filterType
     * @param subgroup
     * @param sort
     * @param limit
     */
    private constructor(name: string,
                        field: string,
                        applicationType: number,
                        filterType: string,
                        subgroup: string[],
                        sort: string[],
                        limit: number) {
        this.name = name;
        this.field = field;
        this.applicationType = applicationType;
        this.filterType = filterType;
        this.subgroup = subgroup;
        this.sort = sort;
        this.limit = limit;
    }

    /**
     * Get name
     *
     * @returns {string}
     */
    getName(): string {
        return this.name;
    }

    /**
     * Get field
     *
     * @returns {string}
     */
    getField(): string {
        return this.field;
    }

    /**
     * getApplicationType
     *
     * @returns {number}
     */
    getApplicationType(): number {
        return this.applicationType;
    }

    /**
     * Get filter type
     *
     * @return {string}
     */
    getFilterType(): string {
        return this.filterType;
    }

    /**
     * Get subgroup
     *
     * @return {[]}
     */
    getSubgroup(): string[] {
        return this.subgroup;
    }

    /**
     * Get sort
     *
     * @return {[]}
     */
    getSort(): string[] {
        return this.sort;
    }

    /**
     * Get limit
     *
     * @return {number}
     */
    getLimit(): number {
        return this.limit;
    }

    /**
     * Create
     *
     * @param name
     * @param field
     * @param applicationType
     * @param filterType
     * @param subgroup
     * @param sort
     * @param limit
     *
     * @returns {Aggregation}
     */
    static create(name: string,
                  field: string,
                  applicationType: number,
                  filterType: string,
                  subgroup: string[] = [],
                  sort: string[] = AGGREGATION_SORT_BY_COUNT_DESC,
                  limit: number = AGGREGATION_NO_LIMIT) {
        return new Aggregation(
            name,
            field,
            applicationType,
            filterType,
            subgroup,
            sort,
            limit
        );
    }

    /**
     * To array
     *
     * @returns {Array}
     */
    toArray() {
        let aggregationAsArray: any = {
            'name': this.name
        };

        if (this.field != 'uuid.type') {
            aggregationAsArray.field = this.field;
        }

        if (this.applicationType != FILTER_AT_LEAST_ONE) {
            aggregationAsArray.application_type = this.applicationType;
        }

        if (this.filterType != FILTER_TYPE_FIELD) {
            aggregationAsArray.filter_type = this.filterType;
        }

        if (this.subgroup.length > 0) {
            aggregationAsArray.subgroup = this.subgroup;
        }

        if (JSON.stringify(this.sort) !== JSON.stringify(AGGREGATION_SORT_BY_COUNT_DESC)) {
            aggregationAsArray.sort = this.sort;
        }

        if (this.limit != AGGREGATION_NO_LIMIT) {
            aggregationAsArray.limit = this.limit;
        }

        return aggregationAsArray;
    }

    /**
     * Create from array
     *
     * @param array
     *
     * @returns {Aggregation}
     */
    static createFromArray(array: any) {
        array = JSON.parse(JSON.stringify(array));
        if (typeof array.field == 'undefined') {
            array.field = 'uuid.type';
        }

        if (typeof array.application_type == 'undefined') {
            array.application_type = FILTER_AT_LEAST_ONE;
        }

        if (typeof array.filter_type == 'undefined') {
            array.filter_type = FILTER_TYPE_FIELD;
        }

        if (typeof array.subgroup == 'undefined') {
            array.subgroup = [];
        }

        if (typeof array.sort == 'undefined') {
            array.sort = AGGREGATION_SORT_BY_COUNT_DESC;
        }
        if (typeof array.limit == 'undefined') {
            array.limit = AGGREGATION_NO_LIMIT;
        }

        return Aggregation.create(
            array.name,
            array.field,
            array.application_type,
            array.filter_type,
            array.subgroup,
            array.sort,
            array.limit
        );
    }
}
