/**
 * Fetch /api/users/me to validate JWT and return user profile.
 * Throws an Error if unauthorized or network error.
 */
async function fetchMe(token) {
  const baseURL = process.env.JAVA_BASE_URL;
  if (!baseURL) throw new Error("JAVA_BASE_URL is missing");

  const res = await fetch(`${baseURL}/api/users/me`, {
    method: "GET",
    headers: {
      Authorization: token,
      Accept: "application/json",
    },
  });

  return res.json();
}

module.exports = { fetchMe };
