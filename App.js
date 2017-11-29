/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';
import Item from './src/Item';
import products from './src/data1';
import { fieldConfigForList, fieldConfigForTable } from './src/fieldConfigType';
import createMediaQuery from './src/createMediaQuery';

const getFieldConfig = createMediaQuery({
  768: fieldConfigForList,
  1024: fieldConfigForTable,
});

// const getFieldConfig = () => {
//   const dimensions = Dimensions.get('window');
//
//   if (dimensions.width > 768) {
//     return fieldConfigForList;
//   } else if (dimenisons.width > 1024) {
//     return fieldConfigForTable;
//   }
// }

const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

export default class App extends Component<{}> {

  constructor() {
    super();
    this.state = {
      orientation: isPortrait() ? 'portrait' : 'landscape'
    }
  }

  handleOrientationChange = (event) => {
    this.setState({
      orientation: isPortrait(event.screen) ? 'portrait' : 'landscape'
    });
  }

  componentWillMount () {
    Dimensions.addEventListener('change', this.handleOrientationChange);
  }

  componentWillUnmount () {
    Dimensions.removeEventListener('change', this.handleOrientationChange);
  }

  render() {
    const { orientation } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          {products.map((product, index) => (
            <Item
              fieldConfig={getFieldConfig()['piece']}
              product={product}
              key={index}
            />
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  wrapper: {
    margin: 0,
    padding: 0,
    flexDirection: 'column'
  },

});
