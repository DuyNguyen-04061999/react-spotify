import { delay } from "./delay";
export const delayDuration = async (
  limitDuration: number,
  startTime: number
) => {
  const endTime = Date.now();
  if (limitDuration) {
    const time = endTime - startTime;
    if (time < limitDuration) {
      const gapTime = limitDuration - time;
      await delay(gapTime);
    }
  }
};
