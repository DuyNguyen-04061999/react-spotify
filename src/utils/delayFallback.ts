export const delayFallback = (importLink: string, delayMs = 0) =>
  new Promise((resolve) => setTimeout(() => resolve(importLink), delayMs));
