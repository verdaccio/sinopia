// eslint-disable no-invalid-this

import lunrMutable from 'lunr-mutable-indexes';
import { Version, IPluginStorage, Config } from '@verdaccio/types';
import { IStorageHandler, IStorage } from './storage';

export interface IWebSearch {
  index: lunrMutable.index;
  storage: IStorageHandler;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query(query: string): any;
  add(pkg: Version): void;
  remove(name: string): void;
  reindex(): void;
  configureStorage(storage: IStorageHandler): void;
}
/**
 * Handle the search Indexer.
 */
class Search implements IWebSearch {
  public index: lunrMutable.index;
  // @ts-ignore
  public storage: IStorageHandler;

  /**
   * Constructor.
   */
  public constructor() {
    this.index = lunrMutable(function (): void {
      // FIXME: there is no types for this library
      /* eslint no-invalid-this:off */
      // @ts-ignore
      this.field('name', { boost: 10 });
      // @ts-ignore
      this.field('description', { boost: 4 });
      // @ts-ignore
      this.field('author', { boost: 6 });
      // @ts-ignore
      this.field('keywords', { boost: 7 });
      // @ts-ignore
      this.field('version');
      // @ts-ignore
      this.field('readme');
    });
  }

  public init() {
    return Promise.resolve();
  }

  /**
   * Performs a query to the indexer.
   * If the keyword is a * it returns all local elements
   * otherwise performs a search
   * @param {*} q the keyword
   * @return {Array} list of results.
   */
  public query(query: string): any[] {
    const localStorage = this.storage.localStorage as IStorage;

    return query === '*'
      ? (localStorage.storagePlugin as IPluginStorage<Config>).get((items): any => {
          items.map(function (pkg): any {
            return { ref: pkg, score: 1 };
          });
        })
      : this.index.search(`*${query}*`);
  }

  /**
   * Add a new element to index
   * @param {*} pkg the package
   */
  public add(pkg: Version): void {
    this.index.add({
      id: pkg.name,
      name: pkg.name,
      description: pkg.description,
      version: `v${pkg.version}`,
      keywords: pkg.keywords,
      author: pkg._npmUser ? pkg._npmUser.name : '???',
    });
  }

  /**
   * Remove an element from the index.
   * @param {*} name the id element
   */
  public remove(name: string): void {
    this.index.remove({ id: name });
  }

  /**
   * Force a re-index.
   */
  public reindex(): void {
    this.storage.getLocalDatabase((error, packages): void => {
      if (error) {
        // that function shouldn't produce any
        throw error;
      }
      let i = packages.length;
      while (i--) {
        this.add(packages[i]);
      }
    });
  }

  /**
   * Set up the {Storage}
   * @param {*} storage An storage reference.
   */
  public configureStorage(storage: IStorageHandler): void {
    this.storage = storage;
    this.reindex();
  }
}

const SearchInstance = new Search();

export { SearchInstance };
