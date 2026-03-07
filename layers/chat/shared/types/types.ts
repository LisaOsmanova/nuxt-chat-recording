export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  projectId: string;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatWithProject extends Chat {
  project: Project | null;
}
