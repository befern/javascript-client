import {KeyValueCache} from "./KeyValueCache";

/**
 * Cache class
 */
export default class NoCache implements KeyValueCache {

    /**
     * Set cache element
     *
     * @param key
     * @param value
     *
     * @returns {void}
     */
    set(key:string, value:any) : void {
        // Empty
    }

    /**
     * Get element from cache
     *
     * @param key
     *
     * @returns {any}
     */
    get(key:string) : any {
        return undefined;
    }

    /**
     * Deletes element from cache
     *
     * @param key
     */
    del(key:string) {
        // Empty
    }

    /**
     * Clear cache
     */
    clear() {
        // Empty
    }
}