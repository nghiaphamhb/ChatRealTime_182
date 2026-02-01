/**
 * Join room of conversation
 */

async function fetchConversation(conversationId, token) {
  const baseURL = process.env.JAVA_BASE_URL;
  if (!baseURL) throw new Error("JAVA_BASE_URL is missing");

  const res = await fetch(`${baseURL}/api/conversations/${conversationId}`, {
    method: "GET",
    headers: {
      Authorization: token,
      Accept: "application/json",
    },
  });

  return res.json();
}

function isMember(conversation, userId) {
  const members = conversation?.members || [];
  return members.some((m) => m.userId === userId);
}

module.exports = { fetchConversation, isMember };
