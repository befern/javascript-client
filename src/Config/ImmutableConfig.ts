import Synonym from "./Synonym";
/**
 * Result class
 */
export default class ImmutableConfig {

    private language:string;
    private storeSearchableMetadata:boolean;
    private synonyms:Synonym[] = [];

    /**
     * Constructor
     *
     * @param language
     * @param storeSearchableMetadata
     */
    constructor(
        language:string = null,
        storeSearchableMetadata:boolean = true
    ) {
        this.language = language;
        this.storeSearchableMetadata = storeSearchableMetadata;
    }

    /**
     * Get language
     *
     * @return {string}
     */
    getLanguage():string {
        return this.language;
    }

    /**
     * Should searchable metadata be stored
     *
     * @return {boolean}
     */
    shouldSearchableMetadataBeStored() : boolean {
        return this.storeSearchableMetadata;
    }

    /**
     * Add synonym
     *
     * @param synonym
     */
    addSynonym(synonym:Synonym) {
        this.synonyms.push(synonym);
    }

    /**
     * Get synonyms
     *
     * @return {Synonym[]}
     */
    getSynonyms() :Synonym[]{
        return this.synonyms;
    }

    /**
     * to array
     */
    toArray() {
        return {
            'language': this.language,
            'store_searchable_metadata': this.storeSearchableMetadata,
            'synonyms': this.synonyms.map(synonym => synonym.toArray())
        };
    }

    /**
     * Create from array
     */
    static createFromArray(array:any) : ImmutableConfig {
        let immutableConfig = new ImmutableConfig(
            array.language ? array.language : null,
            typeof array.store_searchable_metadata == 'boolean'
                ? array.store_searchable_metadata
                : true
        );

        if (
            array.synonyms instanceof Array &&
            array.synonyms.length > 0
        ) {
            immutableConfig.synonyms = array.synonyms.map(synonym => Synonym.createFromArray(synonym))
        }

        return immutableConfig
    }
}