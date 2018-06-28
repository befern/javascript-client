/**
 * Http class
 */
export default class RequestParts {

    private url:string;
    private parameters:any;
    private options:any;

    /**
     * Constructor
     *
     * @param url
     * @param parameters
     * @param options
     */
    constructor(
        url:string,
        parameters:any,
        options:any
    ) {
        this.url = url;
        this.parameters = parameters;
        this.options = options;
    }

    /**
     * Get url
     *
     * @return {string}
     */
    getUrl():string {
        return this.url;
    }

    /**
     * Get parameters
     *
     * @return {any}
     */
    getParameters():any {
        return this.parameters;
    }

    /**
     * Get options
     *
     * @return {any}
     */
    getOptions():any {
        return this.options;
    }
}