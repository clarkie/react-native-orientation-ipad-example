### Handling media queries in react native apps

#### Why?

My latest task was to produce different layout based on orientation changes. I had to take into account few scenarios:

1. In the portrait orientation the layout should be a list but on landscape a table (ADD screenshot)

2. In portrait view (768px) there should be 3 items in the row with some margin between them but except the first item.
  In landscape view (1024px) there should be 4 items in the row with some margin between them but except the first item.
  In landscape view (1366px) there should be 5 items in the row with some margin between them but except the first item.
  (ADD screenshot)
3. Height of the banner should be different on specific width.

I will focus on the first scenario for brevity but the same solution can be addressed in any other situation. I mention other problems to visualise the pattern that lead us to create a generic function which computes the styling object based on provided dimension.

#### How?

This is an example which demonstrate changing the layout based on orientation and specific width on Ipad but the logic can be taken further into mobile phones. We can trigger orientation changes relatively simple by using the Dimensions object provided by RN.

```js
import { Dimensions } from 'react-native';
const dimensions = Dimensions.get('screen');
```

the output is:

```js
{
  fontScale: 1, width: 768, height: 1024, scale: 2
}
```

This is an ipad (portrait) specification.

Basically we created generic function called createMediaQuery which takes the specific breakpoint as a key, the value is either an object or function which includes styling configuration. To apply that function we need to force the component to re-render based on orientation changes.


Lets go over this example:

The parent component, in this case App.js is responsible of re-rendering the component when the orientation is changed.

```js

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
    return (
      <View style={styles.container}>
        ...
      </View>
    );
  }
}
```

We map over the data and render the Item component. Item component is responsible for adapting the layout from the ```getFieldConfig``` function.

```js
const getFieldConfig = createMediaQuery({
  768: fieldConfigForList,
  1024: fieldConfigForTable,
});
```
where:

```js

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
```

The fieldConfig is an object which had several types (for the brevity we only focus on one type which is a piece from our data structure). The **fieldConfigForList** is an object with the key **piece** which has two objects that renders 3 values with specific styling. ---> add screenshot

In the **fieldConfigForTable** we have actually three objects which also renders 3 values but each of the value are located in the separate Text (you will see later on). --->> Add screenshot

Based on the width - we either render **fieldConfigForList** or **fieldConfigForTable**.

It was easier that way to represent UI than on the component itself, mainly because few fields in the table view needs few extra style properties than one on the list.

**renderValues** its a helper function (heavy usage of lodash) which populates 2 values with the dot between them unless one of the values is undefined then the dot is omitted.

<hr />

The **Item.js** component map over the **fieldConfig** prop, which populates the correct data with specific styling. As you can see passing the fieldConfig prop is a more concise way of rendering data with different styling into a component.

We use again our createMediaQuery function to generate the layout for list or table.

```js
const styles = {
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
```

```js
const getStyleConfig = createMediaQuery({
  768: styles.portraitStyle,
  1024: styles.landscapeStyle,
});

const Item = ({ orientation, product, fieldConfig }) => (
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
```

So what is magical createMediaQuery function?

*createMediaQuery* takes an object as an argument, for example:

```js
{
  768: { width: 100, height: 200 },
  1024: { width: 200, height: 50 },
  1366: { ...}
  ...
}
```

```js
import { lte, isFunction, constant } from 'lodash/fp';

import { Dimensions } from 'react-native';
const maxWidth = width => dimensions => lte(dimensions.width, width);

const createMediaQuery = (config) => () => {
  const configPairs = Object.entries(config);  // [ [ '768', { width: 100, height: 200 } ], [ '1024', { width: 200, height: 50 } ...] ]
  const predicateValuePairs = [];
  for (const [width, value] of configPairs) { // width = 768 value = {width: 100, height: 200 }
    const predicate = maxWidth(width); // predicate returns a function because the second argument is not provided in curried functions
    const valueFunc = isFunction(value) ? value : constant(value); // check if the value is an object or a function, if is a function return the value, if is not a function wrap the value and return it
    predicateValuePairs.push([predicate, valueFunc])
  }

  const dimensions = Dimensions.get('window');
  for (const [predicate, valueFunc] of predicateValuePairs) {
    if (predicate(dimensions)) { // if predicate function return true - which means if the supplied width is less or equal to the dimensions return the style object
      return valueFunc();
    }
  }
}


// or using lodash
import { cond, lte, map, toPairs, flow, isFunction, constant } from 'lodash/fp';

const createMediaQuery = flow(
  toPairs,
  map(([width, value]) => [
    maxWidth(width),
    isFunction(value) ? value : constant(value),
  ]),
  (widthAndValuePairs) =>
    () => cond(widthAndValuePairs)(Dimensions.get('window'))
);

```

### Conclusion:
By creating generic createMediaQuery function we can be more flexible of creating new layout to any dimensions, as along as you provide the breakpoints. (write more!)
