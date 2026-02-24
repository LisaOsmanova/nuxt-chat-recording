<script setup lang="ts">
const route = useRoute()
console.log(route.params)
const { chat, messages, sendMessage } = useChat(route.params.id as string)
const typing = ref(false)

const handleSendMessage = async (message: string) => {
  typing.value = true
  await sendMessage(message)
  typing.value = false
}

const appConfig = useAppConfig()
const title = computed(() =>
  chat.value?.title
    ? `${chat.value.title} - ${appConfig.title}`
    : appConfig.title
)

useHead({
  title
})
</script>

<template>
  <ChatWindow
    :chat
    :messages
    :typing
    @send-message="handleSendMessage"
  />
</template>
