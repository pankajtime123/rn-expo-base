import { CommonActions, createNavigationContainerRef, StackActions } from '@react-navigation/native';
export const navigationRef = createNavigationContainerRef();

export async function navigate(routeName: string, params?: object) {
  navigationRef.dispatch(CommonActions.navigate(routeName, params));
}

export async function resetAndNavigate(routeName: string, params?: any, tab?: string) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: tab
          ? [{ name: routeName, state: { index: 0, routes: [{ name: tab, params }] } }]
          : [{ name: routeName, params }],
      }),
    );
  }
}

export async function goBack() {
  navigationRef.dispatch(CommonActions.goBack());
}

export async function push(routeName: string, params?: object) {
  navigationRef.dispatch(StackActions.push(routeName, params));
}

export async function prepareNavigation() {
  navigationRef.isReady();
}

export async function replace(routeName: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(routeName, params));
  }
}
