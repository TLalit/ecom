export const getFirst = async <T>(arr: Promise<T[]> | T[]) => {
  if (Array.isArray(arr)) {
    return arr.length ? arr[0] : null;
  }
  return arr.then((data) => (data.length ? data[0] : null));
};
