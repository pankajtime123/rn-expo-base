export interface AuthenticationAction {
  onLogin: (user: any) => any;
  onLogout: (user: any) => any;
  onCoreServicesUsed?: () => any;
  onNotificationShownInForeground?: (key: string, payload?: object) => any;
  onAppForeground?: (key: string) => any;
  onAppBackground?: (key: string) => any;
  onEventFired?(eventParams: { event: string; params: any }): void;
}
