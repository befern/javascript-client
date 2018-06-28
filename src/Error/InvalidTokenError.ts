import ErrorWithMessage from './ErrorWithMessage';

export default class InvalidTokenError extends ErrorWithMessage {

    /**
     * Get transportable http error
     *
     * @return {number}
     */
    static getTransportableHTTPError() {
        return 401;
    }

    /**
     * Invalid token permissions
     *
     * @param tokenReference
     *
     * @return {InvalidTokenError}
     */
    static createInvalidTokenPermissions(tokenReference) {
        return new InvalidTokenError('Token ' + tokenReference + 'not valid');
    }

    /**
     * Invalid token permissions
     *
     * @param tokenReference
     * @param maxHitsPerQuery
     *
     * @return {InvalidTokenError}
     */
    static createInvalidTokenMaxHitsPerQuery(tokenReference, maxHitsPerQuery) {
        return new InvalidTokenError('Token ' + tokenReference + 'not valid. Max ' + maxHitsPerQuery + ' hits allowed');
    }
}