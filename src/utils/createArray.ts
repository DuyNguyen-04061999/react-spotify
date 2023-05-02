export const createArray = (num: number) => {
  if (num > 0) {
    return new Array(num).fill(null);
  }
};
