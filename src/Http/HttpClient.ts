import Response from "./Response";
/**
 * Http class
 */
export default abstract class HttpClient {

    /**
     * Get
     *
     * @param url
     * @param method
     * @param query
     * @param body
     * @param server
     *
     * @return {Promise<Response>}
     */
    async abstract get(
        url:string,
        method:string,
        query: {any} = {},
        body: {any} = {},
        server: {any} = {}
    ) : Promise<Response>;

    /**
     * Abort current request
     * And regenerate the cancellation token
     */
    abstract abort();
}