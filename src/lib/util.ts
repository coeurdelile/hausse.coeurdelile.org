// naive truncate with bias to split on space
export const summarize = (text: string, len: number) => {
  if (text.length < len) return text;

  const i = len - 1;
  // track back up to 10 characters for a space
  for (let j = 0; j < 10; j++) {
    if (text.charAt(i - j) === " ") {
      return `${text.slice(0, i - j)}…`;
    }
  }
  return `${text.slice(0, i)}…`;
};
