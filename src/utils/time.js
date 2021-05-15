export const formatDuration = (time) => {
  let hours = Math.trunc(time / 60);
  let minutes = time % 60;
  return hours + `h ` + minutes + ` m`;
};