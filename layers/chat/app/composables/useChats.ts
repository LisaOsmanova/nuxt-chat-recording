export default function useChats() {
  // const chats = useState<Chat[]>("chats", () => [MOCK_CHAT]);
  const { data: chats } = useAsyncData(
    "chats",
    () => $fetch<Chat[]>("/api/chats"),
    {
      default: () => [],
    },
  );

  async function fetchChats() {
    const data = await $fetch<Chat[]>("/api/chats");
    chats.value = data;
  }

  function createChat(options: { projectId?: string } = {}) {
    const id = (chats.value.length + 1).toString();
    const chat = {
      id,
      title: `Chat ${id}`,
      messages: [],
      projectId: options.projectId || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    chats.value.push(chat);

    return chat;
  }

  async function createChatAndNavigate(options: { projectId?: string } = {}) {
    const chat = await createChat(options);
    if (chat.projectId) {
      await navigateTo(`/projects/${chat.projectId}/chats/${chat.id}`);
    } else {
      navigateTo(`/chat/${chat.id}`);
    }
  }

  function chatsInProject(projectId: string) {
    return chats.value.filter((chat) => chat.projectId === projectId);
  }

  return {
    chats,
    createChat,
    chatsInProject,
    createChatAndNavigate,
    fetchChats,
  };
}
