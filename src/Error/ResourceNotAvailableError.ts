import ErrorWithMessage from './ErrorWithMessage';

export default class ResourceNotAvailableError extends ErrorWithMessage {

    /**
     * Get transportable http error
     *
     * @return {number}
     */
    static getTransportableHTTPError() {
        return 404;
    }

    /**
     * Index not available
     *
     * @param resourceId
     *
     * @return {InvalidFormatError}
     */
    static indexNotAvailable(resourceId) {
        return new ResourceNotAvailableError('Index not available - ' + resourceId);
    }

    /**
     * Events not available
     *
     * @param resourceId
     *
     * @return {InvalidFormatError}
     */
    static eventsIndexNotAvailable(resourceId) {
        return new ResourceNotAvailableError('Events not available - ' + resourceId);
    }

    /**
     * Logs not available
     *
     * @param resourceId
     *
     * @return {InvalidFormatError}
     */
    static logsIndexNotAvailable(resourceId) {
        return new ResourceNotAvailableError('Logs not available - ' + resourceId);
    }

    /**
     * Engine not available
     *
     * @param resourceId
     *
     * @return {InvalidFormatError}
     */
    static engineNotAvailable(resourceId) {
        return new ResourceNotAvailableError('Engine not available - ' + resourceId);
    }
}