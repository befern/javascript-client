export const DEFAULT_MICROSECONDS_BETWEEN_RETRIES = 1000;

/**
 * Http class
 */
export default class Retry {

    private url:string;
    private method:string;
    private retries:number;
    private microsecondsBetweenRetries:number;

    /**
     * Constructor
     *
     * @param url
     * @param method
     * @param retries
     * @param microsecondsBetweenRetries
     */
    constructor(
        url:string,
        method:string,
        retries:number,
        microsecondsBetweenRetries:number
    ) {
        this.url = url;
        this.method = method;
        this.retries = retries;
        this.microsecondsBetweenRetries = microsecondsBetweenRetries;
    }

    /**
     * Create from array
     *
     * @param array
     *
     * @return {Retry}
     */
    static createFromArray(array:any) : Retry {
        return new Retry(
            array.url ? array.url : '*',
            array.method ? array.method : '*',
            array.retries ? array.retries : 0,
            array.microseconds_between_retries
                ? array.microseconds_between_retries
                : DEFAULT_MICROSECONDS_BETWEEN_RETRIES
        );
    }

    /**
     * Get url
     *
     * @return {string}
     */
    getUrl(): string {
        return this.url;
    }

    /**
     * Get method
     *
     * @return {string}
     */
    getMethod() : string {
        return this.method;
    }

    /**
     * Ge retries
     *
     * @return {number}
     */
    getRetries() : number {
        return this.retries;
    }

    /**
     * Get microseconds between retries
     *
     * @return {number}
     */
    getMicrosecondsBetweenRetries() : number {
        return this.microsecondsBetweenRetries;
    }
}