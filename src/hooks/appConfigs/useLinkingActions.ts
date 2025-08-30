
import RootStore from "@/src/mobxStore/RootStore";
import { useEffect } from "react";
import { Linking } from "react-native";

export enum ELinkingActions {
    LOGIN = 'login',
}

type LinkingHandler = (url: string, params: Record<string, string>) => void;

const handlers: Record<ELinkingActions, LinkingHandler> = {
    [ELinkingActions.LOGIN]: (url, params) => {
        RootStore.authStore.logout()
    },
};

function extractActionAndParams(url: string): { action?: ELinkingActions, params: Record<string, string> } {
    try {
        const parsedUrl = new URL(url);
        const path = parsedUrl.pathname.replace(/^\//, ''); // Remove leading slash
        const action = Object.values(ELinkingActions).find(a => path.startsWith(a));
        const params: Record<string, string> = {};
        parsedUrl.searchParams.forEach((value, key) => {
            params[key] = value;
        });
        return { action: action as ELinkingActions | undefined, params };
    } catch {
        return { action: undefined, params: {} };
    }
}

export const useLinkingActions = () => {
    const handleLinkingActions = (url: string) => {
        const { action, params } = extractActionAndParams(url);
        if (action && handlers[action]) {
            handlers[action](url, params);
        } else {
            // Handle unknown or unsupported action
            console.log("Unknown linking action", url);
        }
    };

    const getInitialURL = async () => {
        try {
            const url = await Linking.getInitialURL();
            if (url) handleLinkingActions(url);
        } catch (error) {
            console.log("error in linking", error);
        }
    };

    useEffect(() => {
        getInitialURL();
    }, []);
};