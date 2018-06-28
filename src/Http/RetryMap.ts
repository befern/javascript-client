import Retry from "./Retry";

/**
 * Http class
 */
export default class RetryMap {

    private retries:any = {};

    /**
     * Add retry
     *
     * @param retry
     */
    addRetry(retry:Retry) {
        this.retries[retry.getUrl() + '~~' + retry.getMethod()] = retry;
    }

    /**
     * Create from array
     */
    static createFromArray(array:any) : RetryMap {
        let retryMap = new RetryMap();
        retryMap.retries = array.map(retry => Retry.createFromArray(retry));

        return retryMap;
    }

    /**
     * Get retry
     *
     * @param url
     * @param method
     *
     * @returns {Retry}
     */
    getRetry(
        url:string,
        method:string
    ) : Retry {
        if (this.retries[url + '~~' + method] instanceof Retry) {
            return this.retries[url + '~~' + method];
        }

        if (this.retries['*~~' + method] instanceof Retry) {
            return this.retries['*~~' + method];
        }

        if (this.retries[url + '~~*'] instanceof Retry) {
            return this.retries[url + '~~*'];
        }

        if (this.retries['*~~*'] instanceof Retry) {
            return this.retries['*~~*'];
        }

        return null;
    }
}