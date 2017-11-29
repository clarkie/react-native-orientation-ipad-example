### Handling media queries in react native apps

#### Why?

My latest task was to produce different layout based on orientation changes. I had to take into account few scenarios:

1. In the portrait orientation the layout should be a list but on landscape a table. (ADD screenshot)

2. In portrait view (768px) there should be 3 items in the row with some margin between them but except the first item.
  In landscape view (1024px) there should be 4 items in the row with some margin between them but except the first item.
  In landscape view (1366px) there should be 5 items in the row with some margin between them but except the first item.
  (ADD screenshot)
3. Height of the banner should be different on specific width.

This second problem was one of the reason why we needed to centralized the media query which will compute the styling based also on specific width.


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
