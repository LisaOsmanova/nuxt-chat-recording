export default defineEventHandler(async (event) => {
  const body = await readBody(event) // extract the body of the request
  const { messages } = body

  const id = messages.length.toString()
  const lastMessage = messages[messages.length - 1]

  return {
    id,
    role: 'assistant',
    content: `(server) You said: ${lastMessage.content}`
  }
})

// event parameter represents the request and response for this endpoint.
