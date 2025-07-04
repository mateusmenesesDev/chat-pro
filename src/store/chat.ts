import { atom } from "jotai";
import type { Message } from "~/features/chat/hooks/useChat";

export const messagesAtom = atom(new Map<string, Message[]>());
