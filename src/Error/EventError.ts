import ErrorWithMessage from './ErrorWithMessage';

/**
 * EventError
 */
export default class EventError extends ErrorWithMessage {


    /**
     * Get transportable http error
     *
     * @return {number}
     */
    static throwEndpointNotAvailable() {
        return new EventError('Endpoint not available');
    }
}