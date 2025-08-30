import { action, makeObservable, observable } from "mobx";

import type { RootStoreType } from "../RootStore";

export interface InfiniteLoadingAPIResponse<T> {
  data: {
    data: T[];
    has_next: boolean;
  };
  hasNext: boolean;
  hostname: string;
}

export abstract class InfiniteLoadingBaseStore<T> {
  rootStore: RootStoreType;
  loggerContext = "InfiniteLoader";
  @observable page = 0;
  @observable limit = 10;
  @observable items: T[] = [];
  @observable total = 0;
  @observable allLoaded = false;
  @observable isLoading = false;
  @observable error = false;
  @observable initialLoaded = false;

  protected constructor(rootStore: RootStoreType) {
    makeObservable(this);
    this.rootStore = rootStore;
  }

  abstract apiCall(): Promise<InfiniteLoadingAPIResponse<T>>;

  @action
  resetContainer() {
    this.page = 1;
    this.limit = 10;
    this.items = [];
    this.total = 0;
    this.allLoaded = false;
    this.isLoading = false;
    this.error = false;
  }

  @action
  resetStore() {
    this.page = 0;
    this.limit = 10;
    this.items = [];
    this.total = 0;
    this.allLoaded = false;
    this.isLoading = false;
    this.error = false;
    this.initialLoaded = false;
  }

  @action
  onLogout() {
    this.resetStore();
  }

  @action
  fetchInitialData() {
    if (!this.initialLoaded || !this.items.length) {
      this.page = 1;
      this.items = [];
      return this.fetchData();
    }
  }

  /** Loads next page of results */
  @action
  loadNextPage(initialLoad?: boolean) {
    if (initialLoad && this.page) return;
    if (this.isLoading || this.allLoaded) {
      console.log(
        this.loggerContext,
        "Not fetching data.",
        this.isLoading ? "Waiting for previous page" : "All data loaded",
      );
      return;
    }

    this.page += 1;
    console.log(this.loggerContext, "Fetching data. Page:", this.page);
    this.fetchData();
  }

  @action
  setData(items: any) {
    this.items = items;
  }

  @action
  fetchData() {
    if (!this.isLoading && !this.allLoaded) {
      this.isLoading = true;
      return this.apiCall()
        .then(
          action((result: InfiniteLoadingAPIResponse<T>) => {
            this.isLoading = false;
            const newData = Array.isArray(result.data.data) ? result.data.data : [];
            this.items = [...this.items, ...newData];
            if (!this.initialLoaded) {
              this.initialLoaded = true;
              console.log(this.loggerContext, "Initial load complete");
            }
            if (!result.data.has_next) {
              this.allLoaded = true;
              console.log(this.loggerContext, "All data loaded");
            }
            return result;
          }),
        )
        .catch(
          action((err: string) => {
            this.isLoading = false;
            this.error = true;
            console.log(err);
            return null;
          }),
        );
    }
  }
}
