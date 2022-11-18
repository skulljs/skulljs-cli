/**
 * async Array.Foreach
 * @param array Array to loop trough
 * @param callback Callback to call on each Element
 */
const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};
export default asyncForEach;
