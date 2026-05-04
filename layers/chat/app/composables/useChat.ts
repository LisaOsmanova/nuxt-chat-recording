export default function useChat(chatId: string) {
  const { chats } = useChats();
  const chat = computed(() => chats.value.find((c) => c.id === chatId));

  const messages = computed<ChatMessage[]>(() => chat.value?.messages || []);

  const { data, execute, status } = useFetch<ChatMessage[]>(
    `/api/chats/${chatId}/messages`,
    {
      default: () => [],
      immediate: false,
    },
  );

  async function fetchMessages({
    refresh = false,
  }: { refresh?: boolean } = {}) {
    const hasExistingMessages = messages.value.length > 1;
    const ifRequestInProgress = status.value !== "idle";
    const shouldSkipDueToExistingState =
      !refresh && (hasExistingMessages || ifRequestInProgress);

    if (shouldSkipDueToExistingState || !chat.value) {
      return;
    }
    await execute();
    chat.value.messages = data.value;
  }

  async function generateChatTitle(message: string) {
    if (!chat.value) return;
    const updatedChat = await $fetch<Chat>(`/api/chats/${chatId}/title`, {
      method: "POST",
      body: {
        message,
      },
    });
    chat.value.title = updatedChat.title;
  }

  async function sendMessage(message: string) {
    if (!chat.value) return;

    if (messages.value.length === 0) {
      await generateChatTitle(message);
    }

    const optimisticUserMessage: ChatMessage = {
      id: `optimistic-user-message-${Date.now()}`,
      role: "user",
      content: message,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    messages.value.push(optimisticUserMessage);

    //to grab the index in order to grab it later
    const userMessageIndex = messages.value.length - 1;

    try {
      const newMessage = await $fetch<ChatMessage>(
        `/api/chats/${chatId}/messages`,
        {
          method: "POST",
          body: {
            content: message,
            role: "user",
          },
        },
      );
      messages.value[userMessageIndex] = newMessage;
    } catch (error) {
      console.error("error sending message:", error);
      messages.value.splice(userMessageIndex, 1);
      return;
    }

    messages.value.push({
      id: `streaming-message-${Date.now()}`,
      role: "assistant",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const lastMessage = messages.value[
      messages.value.length - 1
    ] as ChatMessage;

    try {
      const response = await $fetch<ChatMessage>(
        `/api/chats/${chatId}/messages/stream`,
        {
          method: "POST",
          responseType: "stream",
          body: {
            messages: messages.value,
          },
        },
      );

      //to decode the response
      const decoderStream = response.pipeThrough(new TextDecoderStream());

      //to grab each chunk of the response as it comes through the stream
      const reader = decoderStream.getReader();
      await reader.read().then(function processText({
        done,
        value,
      }): Promise<void> | void {
        if (done) return;
        lastMessage.content += value;
        return reader.read().then(processText);
      });
    } catch (error) {
      console.error("error streaming message:", error);
    } finally {
      //to refetch all of these messages again from the db to make sure everything is up to date
      await fetchMessages({ refresh: true });
    }

    chat.value.updatedAt = new Date();
  }

  return {
    chat,
    messages,
    sendMessage,
    fetchMessages,
  };
}
