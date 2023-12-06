<<<<<<< HEAD
=======
import { useEffect } from "react";
>>>>>>> upstream/main
import { useSearchParams } from "react-router-dom";
import Locale from "./locales";

type Command = (param: string) => void;
interface Commands {
  fill?: Command;
  submit?: Command;
  mask?: Command;
<<<<<<< HEAD
=======
  code?: Command;
  settings?: Command;
>>>>>>> upstream/main
}

export function useCommand(commands: Commands = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

<<<<<<< HEAD
  if (commands === undefined) return;

  let shouldUpdate = false;
  searchParams.forEach((param, name) => {
    const commandName = name as keyof Commands;
    if (typeof commands[commandName] === "function") {
      commands[commandName]!(param);
      searchParams.delete(name);
      shouldUpdate = true;
    }
  });

  if (shouldUpdate) {
    setSearchParams(searchParams);
  }
=======
  useEffect(() => {
    let shouldUpdate = false;
    searchParams.forEach((param, name) => {
      const commandName = name as keyof Commands;
      if (typeof commands[commandName] === "function") {
        commands[commandName]!(param);
        searchParams.delete(name);
        shouldUpdate = true;
      }
    });

    if (shouldUpdate) {
      setSearchParams(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, commands]);
>>>>>>> upstream/main
}

interface ChatCommands {
  new?: Command;
  newm?: Command;
  next?: Command;
  prev?: Command;
  clear?: Command;
  del?: Command;
}

export const ChatCommandPrefix = ":";

export function useChatCommand(commands: ChatCommands = {}) {
  function extract(userInput: string) {
    return (
      userInput.startsWith(ChatCommandPrefix) ? userInput.slice(1) : userInput
    ) as keyof ChatCommands;
  }

  function search(userInput: string) {
    const input = extract(userInput);
    const desc = Locale.Chat.Commands;
    return Object.keys(commands)
      .filter((c) => c.startsWith(input))
      .map((c) => ({
        title: desc[c as keyof ChatCommands],
        content: ChatCommandPrefix + c,
      }));
  }

  function match(userInput: string) {
    const command = extract(userInput);
    const matched = typeof commands[command] === "function";

    return {
      matched,
      invoke: () => matched && commands[command]!(userInput),
    };
  }

  return { match, search };
}
