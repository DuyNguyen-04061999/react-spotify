export const copyToClipBoard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
