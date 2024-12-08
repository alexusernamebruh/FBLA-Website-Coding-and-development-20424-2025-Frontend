export const truncate = (str: string, truncateLength: number) => {
  if (str.length > truncateLength) {
    return str.slice(0, truncateLength) + '...';
  } else {
    return str;
  }
};
