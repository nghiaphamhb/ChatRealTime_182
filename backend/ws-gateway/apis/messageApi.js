/**
 * Java POST messages
 */

async function postMessage(conversationId, token, body) {
  const baseURL = process.env.JAVA_BASE_URL;
  if (!baseURL) throw new Error("JAVA_BASE_URL is missing");

  const res = await fetch(
    `${baseURL}/api/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const err = new Error("HTTP_ERROR");
    err.status = res.status;
    err.detail = data?.error?.message || JSON.stringify(data);
    throw err;
  }

  return res.json();
}

module.exports = { postMessage };
