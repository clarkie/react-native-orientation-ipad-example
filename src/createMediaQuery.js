import { cond, lte, map, toPairs, flow, isFunction, constant } from 'lodash/fp';
import { Dimensions } from 'react-native';

const maxWidth = width => dimensions => lte(dimensions.width, width);

// const createMediaQuery = flow(
//   toPairs,
//   map(([width, value]) => [
//     maxWidth(width),
//     isFunction(value) ? value : constant(value),
//   ]),
//   (widthAndValuePairs) =>
//     () => cond(widthAndValuePairs)(Dimensions.get('window'))
// );

const createMediaQuery = (config) => () => {
  const configPairs = Object.entries(config);  // [ [ '768', { width: 100, height: 200 } ], [ '1024', { width: 300, height: 100 } ] ]
  const predicateValuePairs = [];
  for (const [width, value] of configPairs) { // width = 768 value = {width: 100, height: 200 }
    const predicate = maxWidth(width); // predicate returns a function because the second argument is not provided in curried functions
    const valueFunc = isFunction(value) ? value : constant(value); // check if the value is an object or a function, if is a function return the value, if is not a function wrapp the value and retunrn it
    predicateValuePairs.push([predicate, valueFunc])
  }

  const dimensions = Dimensions.get('window');
  for (const [predicate, valueFunc] of predicateValuePairs) {
    if (predicate(dimensions)) {
      return valueFunc();
    }
  }
}

// const createMediaQuery = (config) => () => {
//   for (const [width, value] of Object.entries(config)) {
//     if (maxWidth(width)(Dimensions.get('window')) {
//       return isFunction(value) ? value() : value;
//     }
//   )
// }

export default createMediaQuery;
