import {KeyValueCache} from "./KeyValueCache";

/**
 * Cache class
 */
export default class InMemoryCache implements KeyValueCache {

    private cache:any = {};
    private size:number = 0;

    /**
     * Constructor
     */
    constructor() {
        this.cache = {};
        this.size = 0;
    }

    /**
     * Set cache element
     *
     * @param key
     * @param value
     *
     * @returns {void}
     */
    set(key:string, value:any) : void {
        this.cache = {
            ...this.cache,
            [key]: value
        };
        this.size = this.size + 1;
    }

    /**
     * Get element from cache
     *
     * @param key
     *
     * @returns {any}
     */
    get(key:string) : any|null {
        return this.cache[key];
    }

    /**
     * Deletes element from cache
     *
     * @param key
     */
    del(key:string) {
        delete this.cache[key];
    }

    /**
     * Clear cache
     */
    clear() {
        this.cache = {};
        this.size = 0;
    }
}