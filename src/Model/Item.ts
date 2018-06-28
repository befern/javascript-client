import InvalidFormatError from "../../src/Error/InvalidFormatError";
import ItemUUID from "./ItemUUID";
import Coordinate from "./Coordinate";

/**
 * Item class
 */
export default class Item {

    private uuid: ItemUUID;
    private coordinate: Coordinate;
    private distance: number;
    private metadata: any = {};
    private indexedMetadata: any = {};
    private searchableMetadata: any = {};
    private exactMatchingMetadata: string[] = [];
    private suggest: string[] = [];
    private highlights: any = {};
    private promoted: boolean = false;

    /**
     * Constructor
     *
     * @param uuid
     * @param coordinate
     * @param metadata
     * @param indexedMetadata
     * @param searchableMetadata
     * @param exactMatchingMetadata
     * @param suggest
     */
    private constructor(uuid: ItemUUID,
                        coordinate: Coordinate,
                        metadata: any,
                        indexedMetadata: any,
                        searchableMetadata: any,
                        exactMatchingMetadata: string[],
                        suggest: string[]) {
        this.uuid = uuid;
        this.coordinate = coordinate;
        this.metadata = metadata;
        this.indexedMetadata = indexedMetadata;
        this.searchableMetadata = searchableMetadata;
        this.exactMatchingMetadata = exactMatchingMetadata;
        this.suggest = suggest;
    }

    /**
     * Create new Item
     *
     * @param uuid
     * @param metadata
     * @param indexedMetadata
     * @param searchableMetadata
     * @param exactMatchingMetadata
     * @param suggest
     * @returns {Item}
     */
    static create(uuid: ItemUUID,
                  metadata: any = {},
                  indexedMetadata: any = {},
                  searchableMetadata: any = {},
                  exactMatchingMetadata: string[] = [],
                  suggest: string[] = []) {
        return new Item(
            uuid,
            null,
            metadata,
            indexedMetadata,
            searchableMetadata,
            exactMatchingMetadata,
            suggest
        )
    }

    /**
     * Create new located Item
     *
     * @param uuid
     * @param coordinate
     * @param metadata
     * @param indexedMetadata
     * @param searchableMetadata
     * @param exactMatchingMetadata
     * @param suggest
     * @returns {Item}
     */
    static createLocated(uuid: ItemUUID,
                         coordinate: Coordinate,
                         metadata: any = {},
                         indexedMetadata: any = {},
                         searchableMetadata: any = {},
                         exactMatchingMetadata: string[] = [],
                         suggest: string[] = []) {
        return new Item(
            uuid,
            coordinate,
            metadata,
            indexedMetadata,
            searchableMetadata,
            exactMatchingMetadata,
            suggest
        )
    }

    /**
     * Get uuid
     *
     * @returns ItemUUID
     */
    getUUID(): ItemUUID {
        return this.uuid;
    }

    /**
     * Get id
     *
     * @returns string
     */
    getId(): string {
        return this.uuid.getId();
    }

    /**
     * Get type
     *
     * @returns string
     */
    getType(): string {
        return this.uuid.getType();
    }

    /**
     * Get coordinate
     *
     * @returns Coordinate|null
     */
    getCoordinate(): Coordinate {
        return this.coordinate;
    }

    /**
     * Get distance
     *
     * @returns int
     */
    getDistance(): number {
        return this.distance;
    }

    /**
     * Get metadata
     *
     * @returns Array
     */
    getMetadata(): any {
        return this.metadata;
    }

    /**
     * Set metadata
     *
     * @param metadata
     */
    setMetadata(metadata: any) {
        this.metadata = metadata;
    }

    /**
     * Add metadata
     *
     * @param key
     * @param value
     */
    addMetadata(key: string,
                value: any) {
        this.metadata[key] = value;
    }

    /**
     * Get indexed metadata
     *
     * @returns Array
     */
    getIndexedMetadata(): any {
        return this.indexedMetadata;
    }

    /**
     * Set indexed metadata
     *
     * @param indexedMetadata
     */
    setIndexedMetadata(indexedMetadata: any) {
        this.indexedMetadata = indexedMetadata;
    }

    /**
     * Add indexed metadata
     *
     * @param key
     * @param value
     */
    addIndexedMetadata(key: string,
                       value: any) {
        this.indexedMetadata[key] = value;
    }

    /**
     * Get searchable metadata
     *
     * @returns Array
     */
    getSearchableMetadata(): any {
        return this.searchableMetadata;
    }

    /**
     * Set searchable metadata
     *
     * @param searchableMetadata
     */
    setSearchableMetadata(searchableMetadata: any) {
        this.searchableMetadata = searchableMetadata;
    }

    /**
     * Add searchable metadata
     *
     * @param key
     * @param value
     */
    addSearchableMetadata(key: string,
                          value: any) {
        this.searchableMetadata[key] = value;
    }

    /**
     * Get exactMatching metadata
     *
     * @returns Array
     */
    getExactMatchingMetadata(): string[] {
        return this.exactMatchingMetadata;
    }

    /**
     * Set exactMatching metadata
     *
     * @param exactMatchingMetadata
     */
    setExactMatchingMetadata(exactMatchingMetadata: string[]) {
        this.exactMatchingMetadata = exactMatchingMetadata;
    }

    /**
     * Add exactMatching metadata
     *
     * @param value
     */
    addExactMatchingMetadata(value: string) {
        this.exactMatchingMetadata.push(value);
    }

    /**
     * Get all metadata
     *
     * @returns {{}}
     */
    getAllMetadata(): any {
        return {...this.metadata, ...this.indexedMetadata};
    }

    /**
     * Get
     *
     * @param key
     *
     * @returns mixed|null
     */
    get(key: string): any {
        let allMetadata = this.getAllMetadata();
        return (typeof allMetadata[key] != 'undefined')
            ? allMetadata[key]
            : null;
    }

    /**
     * Get suggest
     *
     * @returns Array
     */
    getSuggest(): string[] {
        return this.suggest;
    }

    /**
     * Get highlights
     *
     * @returns Array
     */
    getHighlights(): any {
        return this.highlights;
    }

    /**
     * Get highlight
     *
     * @param key
     *
     * @return string|null
     */
    getHighlight(key: string) {
        return (typeof this.highlights[key] != 'undefined')
            ? this.highlights[key]
            : null;
    }

    /**
     * Is promoted
     *
     * @returns boolean
     */
    isPromoted(): boolean {
        return this.promoted;
    }


    /**
     * To array
     */
    toArray(): {
        uuid: {},
        coordinate?: {},
        metadata?: {},
        indexed_metadata?: {},
        searchable_metadata?: {},
        exact_matching_data?: string[],
        suggest?: string[],
        highlights?: {},
        is_promoted?: boolean,
        distance?: number
    } {
        let itemAsArray: {
            uuid: {},
            coordinate?: {},
            metadata?: {},
            indexed_metadata?: {},
            searchable_metadata?: {},
            exact_matching_data?: string[],
            suggest?: string[],
            highlights?: {},
            is_promoted?: boolean,
            distance?: number
        } = {
            'uuid': this.uuid.toArray(),
        };

        if (this.coordinate instanceof Coordinate) {
            itemAsArray['coordinate'] = this.coordinate.toArray();
        }

        if (Object.keys(this.metadata).length > 0) {
            itemAsArray['metadata'] = this.metadata;
        }

        if (Object.keys(this.indexedMetadata).length > 0) {
            itemAsArray['indexed_metadata'] = this.indexedMetadata;
        }

        if (Object.keys(this.searchableMetadata).length > 0) {
            itemAsArray['searchable_metadata'] = this.searchableMetadata;
        }

        if (this.exactMatchingMetadata.length > 0) {
            itemAsArray['exact_matching_metadata'] = this.exactMatchingMetadata;
        }

        if (this.suggest.length > 0) {
            itemAsArray['suggest'] = this.suggest;
        }

        if (Object.keys(this.highlights).length > 0) {
            itemAsArray['highlights'] = this.highlights;
        }

        if (this.isPromoted()) {
            itemAsArray['is_promoted'] = true;
        }

        if (typeof this.distance != 'undefined') {
            itemAsArray['distance'] = this.distance;
        }

        return itemAsArray;
    }

    /**
     * Create from array
     *
     * @param array
     */
    static createFromArray(array: any): Item {
        array = JSON.parse(JSON.stringify(array));
        if (typeof array.uuid != 'object') {
            throw InvalidFormatError.itemUUIDRepresentationNotValid();
        }

        if (
            typeof array.coordinate != 'undefined' &&
            typeof array.coordinate != 'object'
        ) {
            throw InvalidFormatError.coordinateFormatNotValid();
        }

        let item = (
            typeof array.coordinate == 'object' &&
            array.coordinate != null
        )
            ? Item.createLocated(
                ItemUUID.createFromArray(array.uuid),
                Coordinate.createFromArray(array.coordinate),
                ((typeof array.metadata == 'undefined') ? {} : array.metadata),
                ((typeof array.indexed_metadata == 'undefined') ? {} : array.indexed_metadata),
                ((typeof array.searchable_metadata == 'undefined') ? {} : array.searchable_metadata),
                ((typeof array.exact_matching_metadata == 'undefined') ? [] : array.exact_matching_metadata),
                ((typeof array.suggest == 'undefined') ? [] : array.suggest)
            )
            : Item.create(
                ItemUUID.createFromArray(array.uuid),
                ((typeof array.metadata == 'undefined') ? {} : array.metadata),
                ((typeof array.indexed_metadata == 'undefined') ? {} : array.indexed_metadata),
                ((typeof array.searchable_metadata == 'undefined') ? {} : array.searchable_metadata),
                ((typeof array.exact_matching_metadata == 'undefined') ? [] : array.exact_matching_metadata),
                ((typeof array.suggest == 'undefined') ? [] : array.suggest)
            );

        if (
            typeof array.distance != 'undefined' &&
            array.distance != null
        ) {
            item.distance = array.distance;
        }

        if (
            typeof array.highlights == 'object' &&
            array.distance != null
        ) {
            item.highlights = array.highlights;
        }

        if (array.is_promoted) {
            item.promoted = true;
        }

        return item;
    }

    /**
     * Compose uuid
     *
     * @returns string
     */
    composeUUID(): string {
        return this.uuid.composedUUID();
    }
}