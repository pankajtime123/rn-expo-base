import { action } from "mobx";

import { AuthenticationAction } from "./base/AuthenticationAction";

import { AuthStore } from "./domain/Auth/AuthStore";
import { LoginStore } from "./domain/Login/LoginStore";

export type PropsWithStore<T> = T & {
  rootStore?: RootStore;
};

export type RootStoreType = RootStore

class RootStore implements AuthenticationAction {
  loginStore: LoginStore;
  authStore: AuthStore
  stores: any[];

  constructor() {
    this.authStore = new AuthStore(this)
    this.loginStore = new LoginStore(this)

    this.stores = [
      this.authStore,
      this.loginStore,
    ];
  }

  @action
  onLogin(user: any): any {
    this.stores?.forEach((instance) => this.executor(instance, "onLogin", user));
  }

  @action
  onLogout(user: any): any {
    this.stores.forEach((instance) =>
      this.executor(instance, "onLogout", user),
    );
  }


  onCoreServicesUsed() {
    this.stores.forEach((instance) => {
      this.executor(instance, "onCoreServicesUsed");
    });
  }

  @action
  onNotificationShownInForeground(action: string) {
    this.stores.forEach((instance) => {
      this.executor(instance, "onNotificationShownInForeground", action);
    });
    if (action && action === "delink") {
      // do something here
    }
  }

  /* The app state change is triggered everytime the app is foregrounded*/
  @action
  onAppForeground(action: string) {
    this.stores.forEach((instance) => {
      this.executor(instance, "onAppForeground", action);
    });
  }

  /* The app state change is triggered everytime the app is backgrounded*/
  @action
  onAppBackground(action: string) {
    this.stores.forEach((instance) => {
      this.executor(instance, "onAppBackground", action);
    });
  }
  @action
  onEventFired(eventParams: { event: string, params: any }) {
    this.stores.forEach((instance) => {
      this.executor(instance, "onEventFired", eventParams);
    });
  }

  @action
  executor(instance: any, fn: string, args?: any) {
    if (instance && instance[fn] && typeof instance[fn] === "function") {
      try {
        instance[fn](args);
      } catch (e) {
        console.log("Caught error with executor", e);
      }
    }
  }
}

export default new RootStore();
