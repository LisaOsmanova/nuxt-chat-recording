import type {
  Message as PrismaMessage,
  Chat as PrismaChat,
  Project as PrismaProject,
  MessageRole as PrismaMessageRole,
  Prisma,
} from "@prisma/client";

export type Message = PrismaMessage;
export type Chat = PrismaChat;
export type Project = PrismaProject;
export type MessageRole = PrismaMessageRole;

//to get auto-generated types for the ChatWithProject
export type ChatWithProject = Prisma.ChatGetPayload<{
  include: {
    messages: true;
    project: true;
  };
}>;

export type MessageWithChat = Prisma.MessageGetPayload<{
  include: {
    chat: true;
  };
}>;

export type ProjectsWithChats = Prisma.ProjectGetPayload<{
  include: {
    chats: {
      include: {
        messages: true;
      };
    };
  };
}>;
