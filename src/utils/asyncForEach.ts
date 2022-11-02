/**
 * async Array.Foreach
 * @param array Array to loop trough
 * @param callback Callback to call on each Element
 */
const asyncForEach = async <Type>(array: Type[], callback: (element: Type, index: number, array: Type[]) => Promise<any>) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export default asyncForEach;
