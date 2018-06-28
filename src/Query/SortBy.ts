/**
 export * Sort by constants
 */
export const SORT_BY_TYPE_FIELD = 1;
export const SORT_BY_TYPE_NESTED = 2;
export const SORT_BY_ASC = 'asc';
export const SORT_BY_DESC = 'desc';
export const SORT_BY_MODE_AVG = 'avg';
export const SORT_BY_MODE_SUM = 'sum';
export const SORT_BY_MODE_MIN = 'min';
export const SORT_BY_MODE_MAX = 'max';
export const SORT_BY_MODE_MEDIAN = 'median';

export const SORT_BY_SCORE = {
    '_score': {
        'order': SORT_BY_ASC
    }
};
export const SORT_BY_RANDOM = {
    'random': {
        'order': SORT_BY_ASC
    }
};
export const SORT_BY_AL_TUN_TUN = SORT_BY_RANDOM;
export const SORT_BY_ID_ASC = {
    'uuid.id': {
        'order': SORT_BY_ASC
    }
};
export const SORT_BY_ID_DESC = {
    'uuid.id': {
        'order': SORT_BY_DESC
    }
};
export const SORT_BY_TYPE_ASC = {
    'uuid.type': {
        'order': SORT_BY_ASC
    }
};
export const SORT_BY_TYPE_DESC = {
    'uuid.type': {
        'order': SORT_BY_DESC
    }
};
export const SORT_BY_LOCATION_KM_ASC = {
    '_geo_distance': {
        'order': SORT_BY_ASC,
        'unit': 'km'
    }
};
export const SORT_BY_LOCATION_MI_ASC = {
    '_geo_distance': {
        'order': SORT_BY_DESC,
        'unit': 'mi'
    }
};

import Filter from "../../src/Query/Filter";
import Coordinate from "../../src/Model/Coordinate";

/**
 * ScoreStrategy
 */
export default class SortBy {

    private sortsBy: any[] = [];

    /**
     * Create
     *
     * @return {SortBy}
     */
    static create(): SortBy {
        return new SortBy;
    }

    /**
     * Sort By fields values
     *
     * @param shortSortByElements
     *
     * @return {SortBy}
     */
    static byFieldsValues(shortSortByElements: any) {
        let sortBy = SortBy.create();
        for (let key in shortSortByElements) {
            sortBy.byFieldValue(key, shortSortByElements[key]);
        }

        return sortBy;
    }

    /**
     * All
     *
     * @return {Array}
     */
    all(): any {
        return this.sortsBy.length > 0
            ? this.sortsBy
            : [SORT_BY_SCORE];
    }

    /**
     * Sort by value
     *
     * @param value
     *
     * @return {SortBy}
     */
    byValue(value: any): SortBy {
        if (
            SORT_BY_SCORE != value &&
            SORT_BY_RANDOM != value
        ) {
            if (typeof value.type == 'undefined') {
                value.type = SORT_BY_TYPE_FIELD;
            }
        }

        if (SORT_BY_SCORE != value) {
            this.sortsBy.push(value);
        }

        return this;
    }

    /**
     * Sort by field value
     *
     * @param field
     * @param order
     *
     * @return {SortBy}
     */
    byFieldValue(field: string,
                 order: string): SortBy {
        let object = {
            'type': SORT_BY_TYPE_FIELD
        };
        object['indexed_metadata.' + field] = {
            'order': order
        };
        this.sortsBy.push(object);

        return this;
    }

    /**
     * Sort by nested field
     *
     * @param field
     * @param order
     * @param mode
     *
     * @return {SortBy}
     */
    byNestedField(field: string,
                  order: string,
                  mode: string = SORT_BY_MODE_AVG): SortBy {
        let object = {
            'type': SORT_BY_TYPE_NESTED,
            'mode': mode
        };
        object['indexed_metadata.' + field] = {
            'order': order
        };
        this.sortsBy.push(object);

        return this;
    }

    /**
     * Sort by nested field and filter
     *
     * @param field
     * @param order
     * @param filter
     * @param mode
     *
     * @return {SortBy}
     */
    byNestedFieldAndFilter(field: string,
                           order: string,
                           filter: Filter,
                           mode: string = SORT_BY_MODE_AVG): SortBy {
        let fieldPath = Filter.getFilterPathByField(filter.getField());
        let filterAsArray = filter.toArray();
        filterAsArray.field = fieldPath;
        filter = Filter.createFromArray(filterAsArray);
        let object = {
            'type': SORT_BY_TYPE_NESTED,
            'mode': mode,
            'filter': filter
        };
        object['indexed_metadata.' + field] = {
            'order': order
        };
        this.sortsBy.push(object);

        return this;
    }

    /**
     * Is sorted by geo distance
     *
     * @return {boolean}
     */
    isSortedByGeoDistance(): boolean {
        for (let i in this.sortsBy) {
            if (typeof this.sortsBy[i]._geo_distance === typeof {}) {
                return true;
            }
        }

        return false;
    }

    /**
     * Set coordinate
     *
     * @param coordinate
     *
     * @return {SortBy}
     */
    setCoordinate(coordinate: Coordinate): SortBy {
        for (let i in this.sortsBy) {
            if (typeof this.sortsBy[i]._geo_distance === typeof {}) {
                this.sortsBy[i]._geo_distance.coordinate = coordinate;
            }
        }

        return this;
    }

    /**
     * Has random sort
     *
     * @return {boolean}
     */
    hasRandomSort(): boolean {
        for (let i in this.sortsBy) {
            if (JSON.stringify(this.sortsBy[i]) === JSON.stringify(SORT_BY_RANDOM)) {
                return true;
            }
        }

        return false;
    }

    /**
     * To array
     *
     * @return {[]}
     */
    toArray(): any {
        let copySortBy = this.copy();
        let sortsByAsArray = copySortBy.sortsBy;

        for (let i in sortsByAsArray) {
            if (sortsByAsArray[i].type == SORT_BY_TYPE_FIELD) {
                delete sortsByAsArray[i].type;
            }

            if (
                typeof sortsByAsArray[i].filter === typeof {} &&
                sortsByAsArray[i].filter != null
            ) {
                sortsByAsArray[i].filter = sortsByAsArray[i].filter.toArray();
            }

            if (
                typeof sortsByAsArray[i]._geo_distance === typeof {} &&
                sortsByAsArray[i]._geo_distance !== null &&
                sortsByAsArray[i]._geo_distance.coordinate instanceof Coordinate
            ) {
                sortsByAsArray[i]._geo_distance.coordinate = sortsByAsArray[i]._geo_distance.coordinate.toArray();
            }
        }

        return sortsByAsArray;
    }

    /**
     * Create from array
     *
     * @param array
     *
     * @returns {SortBy}
     */
    static createFromArray(array: any): SortBy {
        let innerArray = JSON.parse(JSON.stringify(array));
        let sortBy = SortBy.create();
        for (let i in innerArray) {
            let element = innerArray[i];

            if (
                JSON.stringify(element) !== JSON.stringify(SORT_BY_RANDOM) &&
                JSON.stringify(element) !== JSON.stringify(SORT_BY_SCORE)
            ) {
                if (
                    typeof element.type == 'undefined'
                ) {
                    element.type = SORT_BY_TYPE_FIELD;
                }
            }

            if (
                typeof element.filter === typeof {} &&
                element.filter != null
            ) {
                element.filter = Filter.createFromArray(element.filter);
            }

            if (
                typeof element._geo_distance === typeof {} &&
                element._geo_distance != null &&
                typeof element._geo_distance.coordinate === typeof {}
            ) {
                element._geo_distance.coordinate = Coordinate.createFromArray(element._geo_distance.coordinate);
            }

            sortBy.sortsBy.push(element);
        }

        return sortBy;
    }

    /**
     * Make a copy of this
     *
     * @returns {SortBy}
     */
    copy(): SortBy {
        let newSortBy = SortBy.create();
        for (let i in this.sortsBy) {
            let sortBy = this.sortsBy[i];
            let sortByAsArray = JSON.parse(JSON.stringify(sortBy));

            if (
                typeof sortBy.filter === typeof {} &&
                sortBy.filter != null
            ) {
                sortByAsArray.filter = Filter.createFromArray(sortBy.filter.toArray());
            }

            if (
                typeof sortBy._geo_distance === typeof {} &&
                sortBy._geo_distance != null &&
                typeof sortBy._geo_distance.coordinate == typeof {}
            ) {
                sortByAsArray._geo_distance.coordinate = Coordinate.createFromArray(sortBy._geo_distance.coordinate.toArray());
            }

            newSortBy.sortsBy.push(sortByAsArray);
        }

        return newSortBy;
    }
}
