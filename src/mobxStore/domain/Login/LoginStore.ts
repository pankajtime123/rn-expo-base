

import { action, makeAutoObservable, observable } from "mobx";
import type { RootStoreType } from "../../RootStore";
export class LoginStore {
  rootStore: RootStoreType;

  @observable isLoading: boolean = false;
  @observable error: string | null = null;
  @observable isAuthenticated: boolean = false;

  constructor(rootStore: RootStoreType) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }


  // --- Logout ---
  @action
  async logout() {
    this.isAuthenticated = false;
    this.error = null;
    this.isLoading = false;
  }
}