import InvalidFormatError from "../../src/Error/InvalidFormatError";

/**
 * ItemUUID class
 */
export default class ItemUUID {

    private id: string;
    private type: string;

    /**
     * Constructor
     *
     * @param id
     * @param type
     */
    constructor(id: string,
                type: string) {
        this.id = id;
        this.type = type;
    }

    /**
     * Create composed UUID
     *
     * @param composedUUID
     *
     * @returns {ItemUUID}
     */
    static createByComposedUUID(composedUUID: string): ItemUUID {
        let parts = composedUUID.split('~');
        if (2 != parts.length) {
            throw InvalidFormatError.composedItemUUIDNotValid();
        }

        return new ItemUUID(parts[0], parts[1]);
    }

    /**
     * Return id
     *
     * @returns {string}
     */
    getId(): string {
        return this.id;
    }

    /**
     * Get type
     *
     * @returns {string}
     */
    getType(): string {
        return this.type;
    }

    /**
     * To array
     *
     * @returns {{id: *, type: *}}
     */
    toArray(): {
        id: string,
        type: string
    } {
        return {
            'id': this.id,
            'type': this.type
        };
    }

    /**
     * Create from array
     *
     * @param array {{id:string, type:string}}
     *
     * @return {ItemUUID}
     */
    static createFromArray(array: {id: string, type: string}): ItemUUID {
        array = JSON.parse(JSON.stringify(array));
        return new ItemUUID(
            array.id,
            array.type
        )
    }

    /**
     * Compose unique id
     *
     * @returns {string}
     */
    composedUUID(): string {
        return `${this.id}~${this.type}`;
    }
}
