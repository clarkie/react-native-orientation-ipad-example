import { cond, lte, map, toPairs, flow, isFunction, constant } from 'lodash/fp';
import { Dimensions } from 'react-native';

const maxWidth = width => dimensions => lte(dimensions.width, width);

// const log = name => res => console.log(name, res) || res;

// const createMediaQuery = flow(
//   toPairs, // [ [ '768', { width: 100, height: 200 } ], [ '1024', { width: 300, height: 100 } ] ]
//   map(([width, value]) => [
//     maxWidth(width),
//     isFunction(value) ? value : constant(value),
//   ]),
//   (widthAndValuePairs) =>
//     () => cond(widthAndValuePairs)(Dimensions.get('window'))
// );

const createMediaQuery = (config) => () => {
  const configPairs = Object.entries(config);  // [ [ '768', { width: 100, height: 200 } ], [ '1024', { width: 300, height: 100 } ] ]
  console.log('configPairs', configPairs);
  const predicateValuePairs = [];
  for (const [width, value] of configPairs) { // width = 768 value = {width: 100, height: 200 }
    const predicate = maxWidth(width); // predicate returns a function because the second argument is not provided in curried functions
    console.log('predicate', predicate);
    const valueFunc = isFunction(value) ? value : constant(value); // check if the value is an object or a function, if is a function return the value, if is not a function wrapp the value and retunrn it
    console.log('valueFunc', valueFunc);
    predicateValuePairs.push([predicate, valueFunc])
    console.log('predicateValuePairs', predicateValuePairs);
  }

  const dimensions = Dimensions.get('window');
  for (const [predicate, valueFunc] of predicateValuePairs) {
    if (predicate(dimensions)) {
      console.log('valueFunc', valueFunc())
      return valueFunc();
    }
  }
}

// const getGoodness = cond([
//   [value => isGreat(value), () => 'great']
//   [value => isBad(value), () => 'bad']
// ])
//
// const createMediaQuery = flow(
//   toPairs,
//   map(([width, value]) => [
//     maxWidth(width),
//     isFunction(value) ? value : constant(value),
//   ]),
//   (widthAndValuePairs) =>
//     () => cond(widthAndValuePairs)(Dimensions.get('window'))
// );
//
// const createMediaQuery = (config) => () => {
//   for (const [width, value] of Object.entries(config)) {
//     if (maxWidth(width)(Dimensions.get('window')) {
//       return isFunction(value) ? value() : value;
//     }
//   )
// }

export default createMediaQuery;
