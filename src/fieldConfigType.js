import React from 'react';
import { Text } from 'react-native';
import { get, compact, over, flow, join } from 'lodash/fp';

const defaultText = {
  color: 'black',
  fontSize: 13,
  lineHeight: 18
};

const defaultSecondary = {
  ...defaultText,
  color: 'gray',
};

const styles = {
  title: {
    ...defaultText,
  },
  titleLandscape: {
    width: 300,
    ...defaultText,
  },
  secondaryText: {
    ...defaultSecondary,
  },
  textLandscape: {
    ...defaultSecondary,
    width: 110,
  },
  secondaryTextLandscape: {
    ...defaultSecondary,
    width: 200,
  },
};

const getComposer = get('composer');
const getParentTitle = get(['parentProducts', 0, 'title']);

const renderValues = (funcs) => flow(
  over(funcs),
  compact,
  join(' \u2022 ')
);

export const fieldConfigForList = {
  piece: [
    {
      style: styles.title,
      prop: 'title'
    },
    {
      style: styles.secondaryText,
      fn: (product) => (
        <Text>{renderValues([getComposer, getParentTitle])(product)}</Text>
      ),
    },
  ]
};

export const fieldConfigForTable = {
  piece: [
    { prop: 'title', style: styles.titleLandscape },
    { prop: ['parentProducts', 0, 'composer'], style: styles.textLandscape },
    { prop: ['parentProducts', 0, 'title'], style: styles.secondaryTextLandscape },
  ]
};
