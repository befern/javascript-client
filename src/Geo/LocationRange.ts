import Coordinate from "../Model/Coordinate";

/**
 * Abstract Location Range class
 */
export default abstract class LocationRange {

    /**
     * To filter object
     *
     * @return {{}}}
     */
    abstract toFilterObject(): any;

    /**
     * Get name
     *
     * @return {string}
     */
    abstract getName(): string;

    /**
     * From filter object
     *
     * @param object
     *
     * @return {LocationRange}
     */
    static fromFilterObject(object: any): LocationRange {
        throw TypeError(`Method not valid`);
    }

    /**
     * to array
     */
    toArray(): {type: string, data: any} {
        return {
            'type': this.getName(),
            'data': this.toFilterObject()
        };
    }

    /**
     * Create from array
     *
     * @param array
     */
    static createFromArray(array: any): LocationRange {

        if (array.type == 'CoordinateAndDistance') {
            return CoordinateAndDistance.fromFilterObject(array.data);
        }

        if (array.type == 'Polygon') {
            return Polygon.fromFilterObject(array.data);
        }

        if (array.type == 'Square') {
            return Square.fromFilterObject(array.data);
        }
    }
}

/**
 * CoordinateAndDistance
 */
export class CoordinateAndDistance extends LocationRange {

    private coordinate: Coordinate;
    private distance: string;

    /**
     * Constructor
     *
     * @param coordinate
     * @param distance
     */
    constructor(coordinate: Coordinate,
                distance: string) {
        super();
        this.coordinate = coordinate;
        this.distance = distance;
    }

    /**
     * To filter object
     *
     * @return {{}}}
     */
    toFilterObject(): any {
        return {
            coordinate: this.coordinate.toArray(),
            distance: this.distance
        }
    }

    /**
     * Get name
     *
     * @return {string}
     */
    getName(): string
    {
        return 'CoordinateAndDistance';
    }

    /**
     * From filter object
     *
     * @param object
     *
     * @return {LocationRange}
     */
    static fromFilterObject(object: any): LocationRange {
        return new CoordinateAndDistance(
            Coordinate.createFromArray(object.coordinate),
            object.distance
        );
    }
}

/**
 * Polygon
 */
export class Polygon extends LocationRange {

    private coordinates: Coordinate[];

    /**
     * Constructor
     *
     * @param coordinates
     */
    constructor(coordinates: Coordinate[]) {
        super();

        if (coordinates.length < 3) {
            throw new Error(`A polygon needs more than two coordinates.`);
        }

        this.coordinates = coordinates;
    }

    /**
     * To filter object
     *
     * @return {{coordinates: {lat:number, lon:number}[]}}
     */
    toFilterObject(): any {
        let coordinates:{lat:number, lon:number}[] = [];
        for (let i in this.coordinates) {
            coordinates.push(this.coordinates[i].toArray());
        }
        return {
            coordinates: coordinates
        }
    }

    /**
     * Get name
     *
     * @return {string}
     */
    getName(): string
    {
        return 'Polygon';
    }

    /**
     * From filter object
     *
     * @param object
     *
     * @return {Polygon}
     */
    static fromFilterObject(object: {coordinates: {lat:number, lon:number}[]}): Polygon {

        let coordinates:Coordinate[] = [];
        for (let i in object.coordinates) {
            coordinates.push(Coordinate.createFromArray(object.coordinates[i]));
        }

        return new Polygon(coordinates);
    }
}

/**
 * Square
 */
export class Square extends LocationRange {

    private topLeftCoordinate: Coordinate;
    private bottomRightCoordinate: Coordinate;

    /**
     * Constructor
     *
     * @param topLeftCoordinate
     * @param bottomRightCoordinate
     */
    constructor(topLeftCoordinate: Coordinate,
                bottomRightCoordinate: Coordinate) {
        super();
        this.topLeftCoordinate = topLeftCoordinate;
        this.bottomRightCoordinate = bottomRightCoordinate;
    }

    /**
     * To filter object
     *
     * @return {{}}}
     */
    toFilterObject(): {top_left:{lat:number, lon:number}, bottom_right:{lat:number, lon:number}} {
        return {
            'top_left': this.topLeftCoordinate.toArray(),
            'bottom_right': this.bottomRightCoordinate.toArray()
        }
    }

    /**
     * Get name
     *
     * @return {string}
     */
    getName(): string
    {
        return 'Square';
    }

    /**
     * From filter object
     *
     * @param object
     *
     * @return {LocationRange}
     */
    static fromFilterObject(object: {top_left:{lat:number, lon:number}, bottom_right:{lat:number, lon:number}}): LocationRange {

        return new Square(
            Coordinate.createFromArray(object.top_left),
            Coordinate.createFromArray(object.bottom_right)
        );
    }
}