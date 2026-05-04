export default function useChats() {
  const chats = useState<Chat[]>("chats", () => []);
  const { data, execute, status } = useFetch<Chat[]>("/api/chats", {
    default: () => [],
    immediate: false,
  });

  async function fetchChats() {
    if (status.value !== "idle") return;
    await execute();
    chats.value = data.value;
  }

  async function prefetchChatMessages() {
    //to find the 2 most recently updated chats
    const recentChats = chats.value
      .toSorted(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .slice(0, 2);

    //to prefetch the messages for the 2 most recently updated chats
    await Promise.all(
      recentChats.map(async (chat) => {
        try {
          console.log(`prefetching ${chat.title}`);
          const messages = await $fetch<ChatMessage[]>(
            `/api/chats/${chat.id}/messages`,
          );

          const targetChat = chats.value.find((c) => c.id === chat.id);
          if (targetChat) {
            targetChat.messages = messages;
          }
        } catch (error) {
          console.error(`error prefetching ${chat.id}:`, error);
        }
      }),
    );
  }

  async function createChat(
    options: { projectId?: string; title?: string } = {},
  ) {
    const newChat = await $fetch<Chat>("/api/chats", {
      method: "POST",
      body: {
        title: options.title,
        projectId: options.projectId,
      },
    });

    chats.value.push(newChat);

    return newChat;
  }

  async function createChatAndNavigate(options: { projectId?: string } = {}) {
    const chat = await createChat(options);
    console.log("chat", chat);

    if (chat.projectId) {
      await navigateTo(`/projects/${chat.projectId}/chats/${chat.id}`);
    } else {
      await navigateTo(`/chat/${chat.id}`);
    }
  }

  function chatsInProject(projectId: string) {
    return chats.value.filter((chat) => chat.projectId === projectId);
  }

  return {
    chats,
    createChat,
    createChatAndNavigate,
    chatsInProject,
    fetchChats,
    prefetchChatMessages,
  };
}
