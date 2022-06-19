import create, { GetState, SetState, StateCreator, StoreApi } from "zustand";
import { AuthClient, AuthClientLoginOptions } from "@dfinity/auth-client";
import { Identity } from "@dfinity/agent";
import { persist } from "zustand/middleware";

var authClient: AuthClient;
const DEFAULT_PROVIDER_URL = "https://identity.ic0.app/#authorize";

export interface AuthStore {
  readonly isInitialized: boolean;
  readonly loggedIn: boolean;
  readonly registrationError: string | undefined;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getIdentity: () => Promise<Identity | undefined>;
}

const createAuthStore: StateCreator<AuthStore> | StoreApi<AuthStore> = (
  set,
  get
) => ({
  isInitialized: false,
  loggedIn: false,
  registrationError: undefined,

  login: async (): Promise<void> => {
    localStorage.clear();
    set({ registrationError: undefined });
    authClient = await AuthClient.create();
    const isAuthenticated = await authClient?.isAuthenticated();

    if (!isAuthenticated) {
      await authClient.login(<AuthClientLoginOptions>{
        onSuccess: async (e: any) => {
          set({ loggedIn: true });
        },
        onError: (error) => {
          set({ loggedIn: false, registrationError: error });
        },
        identityProvider: process.env.II_PROVIDER_URL || DEFAULT_PROVIDER_URL,
        // 8 hour session
        maxTimeToLive: BigInt(28_800_000_000_000),
      });
    } else {
      set({ loggedIn: true });
    }
  },

  logout: async () => {
    if (authClient) {
      await authClient.logout();
    }

    // notify components that the user is logged out
    set({ loggedIn: false });

    // clear all state
    localStorage.clear();
    sessionStorage?.clear();
  },

  getIdentity: async (): Promise<Identity | undefined> => {
    if (!authClient) {
      authClient = await AuthClient.create();

      let isAuthenticated = await authClient.isAuthenticated();
      set({ isInitialized: true, loggedIn: isAuthenticated });
    }

    return authClient?.getIdentity();
  },
});

export const useAuthStore = create<AuthStore>(
  persist(
    (set, get, api) => ({
      ...createAuthStore(
        set as SetState<AuthStore>,
        get as GetState<AuthStore>,
        api as StoreApi<AuthStore>
      ),
    }),
    {
      name: "authStore",
    }
  )
);
