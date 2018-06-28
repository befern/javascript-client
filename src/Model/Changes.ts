/**
 * filter constants
 */
export const TYPE_VALUE = 1;
export const TYPE_LITERAL = 4;
export const TYPE_ARRAY_ELEMENT_UPDATE = 8;
export const TYPE_ARRAY_ELEMENT_ADD = 16;
export const TYPE_ARRAY_ELEMENT_DELETE = 32;
export const TYPE_ARRAY_EXPECTS_ELEMENT = 24;
export const TYPE_ARRAY = 56;

/**
 * Changes Type cast
 * @param Changes
 */
export default class Changes {

    /**
     * Changes
     *
     * @type {Array}
     */
    changes: any[] = [];

    /**
     * Add new change
     *
     * @param field
     * @param value
     * @param type
     */
    addChange(field: string,
              value: string,
              type: number = TYPE_VALUE) {
        this.changes.push({
            'field': field,
            'type': type,
            'value': value
        });
    }

    /**
     * Update element from list
     *
     * @param field
     * @param condition
     * @param value
     * @param type
     */
    updateElementFromList(field: string,
                          condition: string,
                          value: string,
                          type: number) {
        this.changes.push({
            'field': field,
            'type': type | TYPE_ARRAY_ELEMENT_UPDATE,
            'condition': condition,
            'value': value
        });
    }

    /**
     * Add element in list
     *
     * @param field
     * @param value
     * @param type
     */
    addElementInList(field: string,
                     value: string,
                     type: number) {
        this.changes.push({
            'field': field,
            'type': type | TYPE_ARRAY_ELEMENT_ADD,
            'value': value
        });
    }

    /**
     * Delete element from list
     *
     * @param field
     * @param condition
     */
    deleteElementFromList(field: string,
                          condition: string) {
        this.changes.push({
            'field': field,
            'type': TYPE_ARRAY_ELEMENT_DELETE,
            'condition': condition
        });
    }

    /**
     * Get changes
     *
     * @returns {[]}
     */
    getChanges(): any[] {
        return this.changes
    }

    /**
     * Create
     *
     * @returns {Changes}
     */
    static create(): Changes {
        return new Changes();
    }

    /**
     * To array
     *
     * @returns {[]}
     */
    toArray(): Object {
        return JSON.parse(JSON.stringify(this.changes));
    }

    /**
     * Create from array
     *
     * @param array
     *
     * @returns {Changes}
     */
    static createFromArray(array: any): Changes {
        array = JSON.parse(JSON.stringify(array));
        let changes = Changes.create();
        changes.changes = array;

        return changes;
    }
}