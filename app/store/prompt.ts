<<<<<<< HEAD
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Fuse from "fuse.js";
import { getLang } from "../locales";
import { StoreKey } from "../constant";

export interface Prompt {
  id?: number;
  isUser?: boolean;
  title: string;
  content: string;
}

export interface PromptStore {
  counter: number;
  latestId: number;
  prompts: Record<number, Prompt>;

  add: (prompt: Prompt) => number;
  get: (id: number) => Prompt | undefined;
  remove: (id: number) => void;
  search: (text: string) => Prompt[];
  update: (id: number, updater: (prompt: Prompt) => void) => void;

  getUserPrompts: () => Prompt[];
=======
import Fuse from "fuse.js";
import { getLang } from "../locales";
import { StoreKey } from "../constant";
import { nanoid } from "nanoid";
import { createPersistStore } from "../utils/store";

export interface Prompt {
  id: string;
  isUser?: boolean;
  title: string;
  content: string;
  createdAt: number;
>>>>>>> upstream/main
}

export const SearchService = {
  ready: false,
  builtinEngine: new Fuse<Prompt>([], { keys: ["title"] }),
  userEngine: new Fuse<Prompt>([], { keys: ["title"] }),
  count: {
    builtin: 0,
  },
  allPrompts: [] as Prompt[],
  builtinPrompts: [] as Prompt[],

  init(builtinPrompts: Prompt[], userPrompts: Prompt[]) {
    if (this.ready) {
      return;
    }
    this.allPrompts = userPrompts.concat(builtinPrompts);
    this.builtinPrompts = builtinPrompts.slice();
    this.builtinEngine.setCollection(builtinPrompts);
    this.userEngine.setCollection(userPrompts);
    this.ready = true;
  },

<<<<<<< HEAD
  remove(id: number) {
=======
  remove(id: string) {
>>>>>>> upstream/main
    this.userEngine.remove((doc) => doc.id === id);
  },

  add(prompt: Prompt) {
    this.userEngine.add(prompt);
  },

  search(text: string) {
    const userResults = this.userEngine.search(text);
    const builtinResults = this.builtinEngine.search(text);
    return userResults.concat(builtinResults).map((v) => v.item);
  },
};

<<<<<<< HEAD
export const usePromptStore = create<PromptStore>()(
  persist(
    (set, get) => ({
      counter: 0,
      latestId: 0,
      prompts: {},

      add(prompt) {
        const prompts = get().prompts;
        prompt.id = get().latestId + 1;
        prompt.isUser = true;
        prompts[prompt.id] = prompt;

        set(() => ({
          latestId: prompt.id!,
          prompts: prompts,
        }));

        return prompt.id!;
      },

      get(id) {
        const targetPrompt = get().prompts[id];

        if (!targetPrompt) {
          return SearchService.builtinPrompts.find((v) => v.id === id);
        }

        return targetPrompt;
      },

      remove(id) {
        const prompts = get().prompts;
        delete prompts[id];
        SearchService.remove(id);

        set(() => ({
          prompts,
          counter: get().counter + 1,
        }));
      },

      getUserPrompts() {
        const userPrompts = Object.values(get().prompts ?? {});
        userPrompts.sort((a, b) => (b.id && a.id ? b.id - a.id : 0));
        return userPrompts;
      },

      update(id: number, updater) {
        const prompt = get().prompts[id] ?? {
          title: "",
          content: "",
          id,
        };

        SearchService.remove(id);
        updater(prompt);
        const prompts = get().prompts;
        prompts[id] = prompt;
        set(() => ({ prompts }));
        SearchService.add(prompt);
      },

      search(text) {
        if (text.length === 0) {
          // return all rompts
          return SearchService.allPrompts.concat([...get().getUserPrompts()]);
        }
        return SearchService.search(text) as Prompt[];
      },
    }),
    {
      name: StoreKey.Prompt,
      version: 1,
      onRehydrateStorage(state) {
        const PROMPT_URL = "./prompts.json";

        type PromptList = Array<[string, string]>;

        fetch(PROMPT_URL)
          .then((res) => res.json())
          .then((res) => {
            let fetchPrompts = [res.en, res.cn];
            if (getLang() === "cn") {
              fetchPrompts = fetchPrompts.reverse();
            }
            const builtinPrompts = fetchPrompts.map(
              (promptList: PromptList) => {
                return promptList.map(
                  ([title, content]) =>
                    ({
                      id: Math.random(),
                      title,
                      content,
                    } as Prompt),
                );
              },
            );

            const userPrompts =
              usePromptStore.getState().getUserPrompts() ?? [];

            const allPromptsForSearch = builtinPrompts
              .reduce((pre, cur) => pre.concat(cur), [])
              .filter((v) => !!v.title && !!v.content);
            SearchService.count.builtin = res.en.length + res.cn.length;
            SearchService.init(allPromptsForSearch, userPrompts);
          });
      },
    },
  ),
=======
export const usePromptStore = createPersistStore(
  {
    counter: 0,
    prompts: {} as Record<string, Prompt>,
  },

  (set, get) => ({
    add(prompt: Prompt) {
      const prompts = get().prompts;
      prompt.id = nanoid();
      prompt.isUser = true;
      prompt.createdAt = Date.now();
      prompts[prompt.id] = prompt;

      set(() => ({
        prompts: prompts,
      }));

      return prompt.id!;
    },

    get(id: string) {
      const targetPrompt = get().prompts[id];

      if (!targetPrompt) {
        return SearchService.builtinPrompts.find((v) => v.id === id);
      }

      return targetPrompt;
    },

    remove(id: string) {
      const prompts = get().prompts;
      delete prompts[id];

      Object.entries(prompts).some(([key, prompt]) => {
        if (prompt.id === id) {
          delete prompts[key];
          return true;
        }
        return false;
      });

      SearchService.remove(id);

      set(() => ({
        prompts,
        counter: get().counter + 1,
      }));
    },

    getUserPrompts() {
      const userPrompts = Object.values(get().prompts ?? {});
      userPrompts.sort((a, b) =>
        b.id && a.id ? b.createdAt - a.createdAt : 0,
      );
      return userPrompts;
    },

    updatePrompt(id: string, updater: (prompt: Prompt) => void) {
      const prompt = get().prompts[id] ?? {
        title: "",
        content: "",
        id,
      };

      SearchService.remove(id);
      updater(prompt);
      const prompts = get().prompts;
      prompts[id] = prompt;
      set(() => ({ prompts }));
      SearchService.add(prompt);
    },

    search(text: string) {
      if (text.length === 0) {
        // return all rompts
        return this.getUserPrompts().concat(SearchService.builtinPrompts);
      }
      return SearchService.search(text) as Prompt[];
    },
  }),
  {
    name: StoreKey.Prompt,
    version: 3,

    migrate(state, version) {
      const newState = JSON.parse(JSON.stringify(state)) as {
        prompts: Record<string, Prompt>;
      };

      if (version < 3) {
        Object.values(newState.prompts).forEach((p) => (p.id = nanoid()));
      }

      return newState as any;
    },

    onRehydrateStorage(state) {
      const PROMPT_URL = "./prompts.json";

      type PromptList = Array<[string, string]>;

      fetch(PROMPT_URL)
        .then((res) => res.json())
        .then((res) => {
          let fetchPrompts = [res.en, res.cn];
          if (getLang() === "cn") {
            fetchPrompts = fetchPrompts.reverse();
          }
          const builtinPrompts = fetchPrompts.map((promptList: PromptList) => {
            return promptList.map(
              ([title, content]) =>
                ({
                  id: nanoid(),
                  title,
                  content,
                  createdAt: Date.now(),
                }) as Prompt,
            );
          });

          const userPrompts = usePromptStore.getState().getUserPrompts() ?? [];

          const allPromptsForSearch = builtinPrompts
            .reduce((pre, cur) => pre.concat(cur), [])
            .filter((v) => !!v.title && !!v.content);
          SearchService.count.builtin = res.en.length + res.cn.length;
          SearchService.init(allPromptsForSearch, userPrompts);
        });
    },
  },
>>>>>>> upstream/main
);
