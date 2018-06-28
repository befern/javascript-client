import ErrorWithMessage from './ErrorWithMessage';

export default class ConnectionError extends ErrorWithMessage {

    /**
     * Get transportable http error
     *
     * @return {number}
     */
    static getTransportableHTTPError() {
        return 500;
    }
}