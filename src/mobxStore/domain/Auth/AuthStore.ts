import { RootStackScreens } from "@/src/navigation/RootStack/types";
import { clearSecureEntries, saveTokens, saveUser } from "@/src/services/token.service";
import { resetAndNavigate } from "@/src/utils/NavigationUtils";
import MMKVStorage from "@/src/utils/storages/MMKVStorage/MMKVStorage";
import { action, makeAutoObservable, observable } from "mobx";
import type { RootStoreType } from "../../RootStore";

export class AuthStore {
  rootStore: RootStoreType;

  @observable user: any | undefined = undefined;
  @observable isLoading: boolean = false;
  @observable error = null;
  @observable isAuthenticated: boolean = false
  @observable authData: any | undefined= undefined 

  constructor(rootStore: RootStoreType) {
    this.rootStore = rootStore
    makeAutoObservable(this);
  }

  @action
  async setUser(data: any | undefined) {
    this.isAuthenticated = !!data?.user

    try {
      if (data) {
        this.user = data.user;
        this.authData = data
        await Promise.all([saveTokens(data), saveUser(data)])
        this.rootStore.onLogin(data)
      }
    } catch (error) {

    }
  }


  @action
  async logout() {
    const user = this.user;
    this.user = undefined;
    this.error = null
    this.isLoading = false
    this.isAuthenticated = false

    try {
      await clearSecureEntries()
      MMKVStorage.mmkvClearAll()
      await this.rootStore.onLogout(user)
      resetAndNavigate(RootStackScreens.Login)
    } catch (error) {
      console.error("A+++", error)
    }
  }
}

