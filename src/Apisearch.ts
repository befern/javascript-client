import AxiosClient from "./Http/AxiosClient";
import Query from "./Query/Query";
import {KeyValueCache} from "./Cache/KeyValueCache";
import RetryMap from "./Http/RetryMap";
import HttpRepository from "./Repository/HttpRepository";
import ImmutableConfig from "./Config/ImmutableConfig";
import HttpClient from "./Http/HttpClient";
import Result from "./Result/Result";
import NoCache from "./Cache/NoCache";
import Item from "./Model/Item";
import ItemUUID from "./Model/ItemUUID";
import Repository from "./Repository/Repository";
import {Md5} from "ts-md5";

/**
 * Apisearch class
 */
export default class Apisearch {

    private repositories:any = {};

    /**
     * Create instance
     *
     * @return {Apisearch}
     */
    static create() : Apisearch {
        return new Apisearch;
    }

    /**
     * Constructor
     *
     * @param name
     * @param config
     */
    createRepository(
        name:string,
        config:{
            app_id:string,
            index_id:string,
            token:string,
            options: {
                endpoint?:string,
                api_version?:string,
                timeout?:number,
                override_queries?:boolean,
                cache?: KeyValueCache
            }
        }
    ) {
        config.options = {
            api_version: 'v1',
            timeout: 10000,
            override_queries: true,
            cache: new NoCache(),
            ...config.options,
        };

        /**
         * Client
         */
        let httpClient = new AxiosClient(
            config.options.endpoint,
            config.options.api_version,
            config.options.timeout,
            new RetryMap(),
            config.options.override_queries,
            config.options.cache
        );

        let builtRepository = new HttpRepository(
            httpClient,
            config.app_id,
            config.index_id,
            config.token,
        );

        this.repositories[name] = builtRepository;
        return builtRepository;
    }

    /**
     * Get repository
     *
     * @param name
     *
     * @return {Repository|null}
     */
    getRepository(name:string) : Repository|null {
        return this.repositories[name] instanceof Repository
            ? this.repositories[name]
            : null;
    }
}