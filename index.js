import { registerRootComponent } from "expo";
import { LogBox } from "react-native";
import { enableFreeze, enableScreens } from "react-native-screens";
import App from "./App";

registerRootComponent(App);
enableScreens();
enableFreeze(true);

const IGNORED_LOGS = [
  "Warning",
  "Require cycle",
  "Sending",
  "Unknown",
  "[MobX] Since strict-mode is enabled,",
  "VirtualizedLists should never be nested",
  "Module SmallcaseGateway requires",
];

LogBox.ignoreLogs(IGNORED_LOGS);

const withoutIgnored =
  (logger, ignore, prefix) =>
  (...args) => {
    const output = args.join(" ");

    if (!IGNORED_LOGS.some((log) => output.includes(log))) {
      if (!ignore) {
        // collectLogs(output);
      }
      args.unshift(prefix);
      if (__DEV__) {
        logger(...args);
      }
    }
  };

console.debug = withoutIgnored(console.debug, false, "[debug]");
console.log = withoutIgnored(console.log, false, "[log]");
console.info = withoutIgnored(console.info, true, "[info]");
console.warn = withoutIgnored(console.warn, false, "[warn]");
console.error = withoutIgnored(console.error, false, "[error]");
