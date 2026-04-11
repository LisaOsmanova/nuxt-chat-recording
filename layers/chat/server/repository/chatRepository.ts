import { v4 as uuidv4 } from "uuid";
import { getProjectById } from "./projectRepository";

const storage = useStorage<Chat[]>("db");
const chatsKey = "chats:all";

async function getChats(): Promise<Chat[]> {
  let chats = await storage.getItem(chatsKey);

  if (chats === null) {
    chats = [MOCK_CHAT];
    await saveChats(chats);
  }

  return chats;
}

async function saveChats(chats: Chat[]): Promise<void> {
  await storage.setItem(chatsKey, chats);
}

export async function getAllChats(): Promise<Chat[]> {
  const chats = await getChats();
  let transformedChats = await Promise.all(
    chats.map(async (chat) => {
      const lastMessage = await getLastMessageForChat(chat.id);
      return {
        ...chat,
        messages: lastMessage ? [lastMessage] : [],
        project: chat.projectId
          ? (await getProjectById(chat.projectId)) || undefined
          : undefined,
      };
    }),
  );
  transformedChats = transformedChats.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  return transformedChats;
}

export async function createChat(data: {
  title?: string;
  projectId?: string;
}): Promise<ChatWithProject | null> {
  const now = new Date();
  const newChat: Chat = {
    id: uuidv4(),
    title: data.title || "New Chat",
    projectId: data.projectId,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };

  const chats = await getChats();
  chats.push(newChat);
  await saveChats(chats);

  // No messages yet, so lastMessage is always []
  return {
    ...newChat,
    messages: [],
    project: data.projectId
      ? (await getProjectById(data.projectId)) || null
      : null,
  };
}

export async function getChatById(
  id: string,
): Promise<(Chat & { project: Project | null }) | null> {
  const chat = chats.find((c) => c.id === id);
  if (!chat) return null;
  const lastMessage = getLastMessageForChat(id);
  return {
    ...chat,
    messages: lastMessage ? [lastMessage] : [],
    project: chat.projectId ? getProjectById(chat.projectId) || null : null,
  };
}

export async function updateChat(
  id: string,
  data: { title?: string; projectId?: string },
): Promise<ChatWithProject | null> {
  const chatIndex = chats.findIndex((c) => c.id === id);
  if (chatIndex === -1) return null;
  const chat = chats[chatIndex];
  if (!chat) return null;
  const updatedChat: Chat = {
    ...chat,
    ...(data.title && { title: data.title }),
    ...(data.projectId !== undefined && {
      projectId: data.projectId,
    }),
    updatedAt: new Date(),
  };
  chats[chatIndex] = updatedChat;
  const lastMessage = getLastMessageForChat(id);
  return {
    ...updatedChat,
    messages: lastMessage ? [lastMessage] : [],
    project: updatedChat.projectId
      ? getProjectById(updatedChat.projectId) || null
      : null,
  };
}

export async function deleteChat(id: string): Promise<boolean> {
  const index = chats.findIndex((chat) => chat.id === id);
  if (index !== -1) {
    chats.splice(index, 1);
    deleteMessagesForChat(id);
    return true;
  }
  return false;
}

export function getMessagesByChatId(chatId: string): ChatMessage[] {
  const chat = chats.find((c) => c.id === chatId);
  if (!chat) return [];
  return [...chat.messages].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  );
}

export async function createMessageForChat(data: {
  content: string;
  role: "user" | "assistant";
  chatId: string;
}): Promise<ChatMessage | null> {
  const chat = chats.find((c) => c.id === data.chatId);
  if (!chat) return null;
  const now = new Date();
  const newMessage: ChatMessage = {
    id: uuidv4(),
    content: data.content,
    role: data.role,
    createdAt: now,
    updatedAt: now,
  };
  chat.messages.push(newMessage);
  chat.updatedAt = now;
  return newMessage;
}

export function deleteMessagesForChat(chatId: string): void {
  const chat = chats.find((c) => c.id === chatId);
  if (chat) {
    chat.messages = [];
    chat.updatedAt = new Date();
  }
}

export function getLastMessageForChat(chatId: string): ChatMessage | null {
  const chat = chats.find((c) => c.id === chatId);
  if (!chat || chat.messages.length === 0) return null;
  return chat.messages.reduce((latest, msg) =>
    msg.createdAt > latest.createdAt ? msg : latest,
  );
}
