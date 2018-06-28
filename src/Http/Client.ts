import RetryMap from "./RetryMap";
import RequestParts from "./RequestParts";
/**
 * Client
 */
export default abstract class Client {
    protected version:string;
    protected retryMap:RetryMap;

    /**
     * Constructor
     *
     * @param version
     * @param retryMap
     */
    constructor(
        version:string,
        retryMap:RetryMap
    ) {
        this.retryMap = retryMap;
        this.version = version.replace(/^\/*|\/*$/g, '');
    }

    /**
     * Build request parts
     *
     * @param url
     * @param query
     * @param body
     * @param server
     *
     * @return {RequestParts}
     */
    buildRequestParts(
        url:string,
        query:any = {},
        body:any = {},
        server:any = {}
    ): RequestParts {
        url = url.replace(/^\/*|\/*$/g, '');
        url = '/' + (this.version + '/' + url).replace(/^\/*|\/*$/g, '')
        url = Client.buildUrlParams(url, query);

        return new RequestParts(
            url,
            {
                'json': body,
                'headers': server
            },
            {
                'decode_content': 'gzip'
            }
        )
    }

    /**
     * Build url params
     *
     * @param url
     * @param params
     *
     * @returns {string}
     */
    private static buildUrlParams(
        url:string,
        params:any
    ):string {

        let builtParams:string[] = [];
        for(let i in params) {
            builtParams.push(i + '=' + params[i])
        }

        return url + '?' + builtParams.join('&');
    }
}