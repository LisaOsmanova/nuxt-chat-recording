<script setup lang="ts">
const appConfig = useAppConfig();
const { createChat } = useChats();

const handleCreateChat = () => {
  createChat();
};
</script>

<template>
  <UContainer class="page-container">
    <span class="text-2xl font-bold mb-2">{{ appConfig.title }}</span>
    <UButton @click="handleCreateChat" class="button"> Start Chat </UButton>
  </UContainer>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.title {
  font-size: 2.25rem;
  font-weight: bold;
}

.button {
  margin-top: 1rem;
}
</style>
