import ErrorWithMessage from './ErrorWithMessage';

export default class UnsupportedContentTypeError extends ErrorWithMessage {

    /**
     * Get transportable http error
     *
     * @return {number}
     */
    static getTransportableHTTPError() {
        return 415;
    }

    /**
     * Unsupported content type
     *
     * @return {InvalidFormatError}
     */
    static createUnsupportedContentTypeException() {
        return new UnsupportedContentTypeError('This content type is not accepted. Please use application/json');
    }
}