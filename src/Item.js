import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { get } from 'lodash/fp';
import createMediaQuery from './createMediaQuery';

const styles = {
  container: {
    height: 64,
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1
  },
  landscapeStyle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  portraitStyle: {
    justifyContent: 'center',
    flexDirection: 'column',
  },
};

const getStyleConfig = createMediaQuery({
  768: styles.portraitStyle,
  1024: styles.landscapeStyle,
});


export default ({ orientation, product, fieldConfig }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => {}}>
      <View
        style={getStyleConfig()}
      >
        {fieldConfig.map(({ style, prop, fn }, index) => (
          <Text
            key={index}
            style={{
              ...style,
            }}
          >
            {fn ? fn(product) : get(prop, product)}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  </View>
);
