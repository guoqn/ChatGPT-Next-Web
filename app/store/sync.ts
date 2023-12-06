<<<<<<< HEAD
import { Updater } from "../typing";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKey } from "../constant";
=======
import { getClientConfig } from "../config/client";
import { Updater } from "../typing";
import { ApiPath, STORAGE_KEY, StoreKey } from "../constant";
import { createPersistStore } from "../utils/store";
import {
  AppState,
  getLocalAppState,
  GetStoreState,
  mergeAppState,
  setLocalAppState,
} from "../utils/sync";
import { downloadAs, readFromFile } from "../utils";
import { showToast } from "../components/ui-lib";
import Locale from "../locales";
import { createSyncClient, ProviderType } from "../utils/cloud";
import { corsPath } from "../utils/cors";
>>>>>>> upstream/main

export interface WebDavConfig {
  server: string;
  username: string;
  password: string;
}

<<<<<<< HEAD
export interface SyncStore {
  webDavConfig: WebDavConfig;
  lastSyncTime: number;

  update: Updater<WebDavConfig>;
  check: () => Promise<boolean>;

  path: (path: string) => string;
  headers: () => { Authorization: string };
}

const FILE = {
  root: "/chatgpt-next-web/",
};

export const useSyncStore = create<SyncStore>()(
  persist(
    (set, get) => ({
      webDavConfig: {
        server: "",
        username: "",
        password: "",
      },

      lastSyncTime: 0,

      update(updater) {
        const config = { ...get().webDavConfig };
        updater(config);
        set({ webDavConfig: config });
      },

      async check() {
        try {
          const res = await fetch(this.path(""), {
            method: "PROFIND",
            headers: this.headers(),
          });
          console.log(res);
          return res.status === 207;
        } catch (e) {
          console.error("[Sync] ", e);
          return false;
        }
      },

      path(path: string) {
        let url = get().webDavConfig.server;

        if (!url.endsWith("/")) {
          url += "/";
        }

        if (path.startsWith("/")) {
          path = path.slice(1);
        }

        return url + path;
      },

      headers() {
        const auth = btoa(
          [get().webDavConfig.username, get().webDavConfig.password].join(":"),
        );

        return {
          Authorization: `Basic ${auth}`,
        };
      },
    }),
    {
      name: StoreKey.Sync,
      version: 1,
    },
  ),
=======
const isApp = !!getClientConfig()?.isApp;
export type SyncStore = GetStoreState<typeof useSyncStore>;

const DEFAULT_SYNC_STATE = {
  provider: ProviderType.WebDAV,
  useProxy: true,
  proxyUrl: corsPath(ApiPath.Cors),

  webdav: {
    endpoint: "",
    username: "",
    password: "",
  },

  upstash: {
    endpoint: "",
    username: STORAGE_KEY,
    apiKey: "",
  },

  lastSyncTime: 0,
  lastProvider: "",
};

export const useSyncStore = createPersistStore(
  DEFAULT_SYNC_STATE,
  (set, get) => ({
    coundSync() {
      const config = get()[get().provider];
      return Object.values(config).every((c) => c.toString().length > 0);
    },

    markSyncTime() {
      set({ lastSyncTime: Date.now(), lastProvider: get().provider });
    },

    export() {
      const state = getLocalAppState();
      const datePart = isApp
      ? `${new Date().toLocaleDateString().replace(/\//g, '_')} ${new Date().toLocaleTimeString().replace(/:/g, '_')}`
      : new Date().toLocaleString();

      const fileName = `Backup-${datePart}.json`;
      downloadAs(JSON.stringify(state), fileName);
    },

    async import() {
      const rawContent = await readFromFile();

      try {
        const remoteState = JSON.parse(rawContent) as AppState;
        const localState = getLocalAppState();
        mergeAppState(localState, remoteState);
        setLocalAppState(localState);
        location.reload();
      } catch (e) {
        console.error("[Import]", e);
        showToast(Locale.Settings.Sync.ImportFailed);
      }
    },

    getClient() {
      const provider = get().provider;
      const client = createSyncClient(provider, get());
      return client;
    },

    async sync() {
      const localState = getLocalAppState();
      const provider = get().provider;
      const config = get()[provider];
      const client = this.getClient();

      try {
        const remoteState = JSON.parse(
          await client.get(config.username),
        ) as AppState;
        mergeAppState(localState, remoteState);
        setLocalAppState(localState);
      } catch (e) {
        console.log("[Sync] failed to get remote state", e);
      }

      await client.set(config.username, JSON.stringify(localState));

      this.markSyncTime();
    },

    async check() {
      const client = this.getClient();
      return await client.check();
    },
  }),
  {
    name: StoreKey.Sync,
    version: 1.1,

    migrate(persistedState, version) {
      const newState = persistedState as typeof DEFAULT_SYNC_STATE;

      if (version < 1.1) {
        newState.upstash.username = STORAGE_KEY;
      }

      return newState as any;
    },
  },
>>>>>>> upstream/main
);
