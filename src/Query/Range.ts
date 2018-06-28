/**
 * Aggregation constants
 */
export const RANGE_ZERO = 0;
export const RANGE_INFINITE = -1;
export const RANGE_SEPARATOR = '..';

/**
 * Filter class
 */
export default class Range {

    /**
     * Strong to array
     *
     * @param string
     *
     * @returns {[number, number]}
     */
    static stringToArray(string: string): [number, number] {
        let parts = string.split(RANGE_SEPARATOR);
        let from = parts[0];
        let to = parts[1];
        let finalFrom: number = RANGE_ZERO;
        let finalTo: number = RANGE_INFINITE;

        if (from != "") {
            finalFrom = parseInt(from);
        }

        if (to != "") {
            finalTo = parseInt(to);
        }

        return [finalFrom, finalTo];

    }

    /**
     * Array to string
     *
     * @param values
     *
     * @return {string}
     */
    static arrayToString(values: [number, number]): string {
        let finalValues: [string, string] = ['', ''];
        if (values[0] != RANGE_ZERO) {
            finalValues[0] = String(values[0]);
        }

        if (values[1] != RANGE_INFINITE) {
            finalValues[1] = String(values[1]);
        }

        return finalValues.join(RANGE_SEPARATOR);
    }

    /**
     * Create ranges
     *
     * @param from
     * @param to
     * @param incremental
     */
    static createRanges(from: number,
                        to: number,
                        incremental: number): string[] {
        let ranges = [];
        let nextTo;
        while (from < to) {
            nextTo = from + incremental;
            ranges.push(from + RANGE_SEPARATOR + nextTo);
            from = nextTo;
        }

        return ranges;
    }
}