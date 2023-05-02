type Key = string;
const TOKEN_KEY = "token";

const createStore = (key: Key) => ({
  set: (data: any) => localStorage.setItem(key, JSON.stringify(data)),
  get: () => JSON.parse(localStorage.getItem(key) || "null"),
  clear: () => localStorage.removeItem(key),
});

export const storeToken = createStore(TOKEN_KEY);
