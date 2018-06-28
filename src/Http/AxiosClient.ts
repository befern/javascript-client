import HttpClient from "./HttpClient";
import {KeyValueCache} from "../Cache/KeyValueCache";
import Axios from "axios";
import Client from "./Client";
import RetryMap from "./RetryMap";
import Response from "./Response";

/**
 * AxiosClient
 */
export default class AxiosClient extends Client implements HttpClient {

    private host:string;
    private cache:KeyValueCache;
    private timeout:number;
    private overrideQueries:boolean;
    private cancelToken;

    /**
     * Constructor
     *
     * @param host
     * @param version
     * @param timeout
     * @param retryMap
     * @param overrideQueries
     * @param cache
     */
    constructor(
        host:string,
        version:string,
        timeout:number,
        retryMap:RetryMap,
        overrideQueries:boolean,
        cache:KeyValueCache
    ) {
        super(version, retryMap);

        this.host = host;
        this.timeout = timeout;
        this.cache = cache;
        this.overrideQueries = overrideQueries;
        this.cancelToken = Axios.CancelToken.source();
    }

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
    async get(
        url:string,
        method:string,
        query: any = {},
        body: any = {},
        server: any = {}
    ) : Promise<Response> {
        let cachedResponse = this.cache.get(query.url);
        if (cachedResponse instanceof Response) {
            return new Promise<Response>(
                resolve => resolve(cachedResponse)
            );
        }

        return await this.fetchData(
            url,
            method,
            query,
            body,
            server
        );
    }

    /**
     * Fetch data using Axios
     *
     * @param url
     * @param method
     * @param query
     * @param body
     * @param server
     *
     * @return {Promise<Response>}
     */
    private async fetchData(
        url:string,
        method:string,
        query: any,
        body: any,
        server: any
    ) : Promise<Response> {
        let that = this;

        method = method.toLowerCase();
        query.options = {
            ...query.options,
            cancelToken: this.cancelToken.token
        };

        if (
            'get' === method &&
            this.overrideQueries
        ) {
            this.abort();
        }

        let requestParts = that.buildRequestParts(
            url,
            query,
            body,
            server
        );

        return new Promise<Response> ((resolve, reject) => {

            //noinspection TypeScriptValidateTypes
            Axios.create({
                baseURL: that.host.replace(/\/*$/g, ''),
                headers: requestParts.getParameters().headers,
                method: method,
                url: requestParts.getUrl(),
                data: requestParts.getParameters().json,
                timeout: that.timeout,
            }).request({
                method: method
            })
            .then(axiosResponse => {

                let response = new Response(
                    axiosResponse.status,
                    axiosResponse.data
                );

                that.cache.set(
                    query.url,
                    response
                );

                return resolve(response);
            })
            .catch(
                thrown => reject(thrown)
            );
        });
    }

    /**
     * Abort current request
     * And regenerate the cancellation token
     */
    abort() {
        this.cancelToken.cancel();
        this.cancelToken = Axios.CancelToken.source();
    }
}