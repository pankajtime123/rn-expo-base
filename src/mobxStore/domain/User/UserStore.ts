import { action, makeObservable, observable } from "mobx";
import RootStore from "../../RootStore";

export class UserStore {
    rootStore: typeof RootStore
    @observable isFetchingUser: boolean = false

    constructor(rootStore: typeof RootStore) {
        makeObservable(this);
        this.rootStore = rootStore
    }

    @action
    onLogout() {
        this.isFetchingUser = false
    }
}