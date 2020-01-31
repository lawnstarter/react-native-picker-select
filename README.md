# react-native-picker-select

[![npm version](https://badge.fury.io/js/react-native-picker-select.svg)](https://badge.fury.io/js/react-native-picker-select)
[![npm downloads](https://img.shields.io/npm/dm/react-native-picker-select.svg?style=flat-square)](https://www.npmjs.com/package/react-native-picker-select)
[![Test Coverage](https://api.codeclimate.com/v1/badges/095f5b1ee137705ed382/test_coverage)](https://codeclimate.com/github/lawnstarter/react-native-picker-select/test_coverage)
[![CircleCI](https://circleci.com/gh/lawnstarter/react-native-picker-select.svg?style=svg)](https://circleci.com/gh/lawnstarter/react-native-picker-select)

A Picker component for React Native which emulates the native `<select>` interfaces for iOS and Android

For iOS, by default we are wrapping an unstyled TextInput component. You can then pass down styles to customize it to your needs.

For Android, by default we are using the native Picker component. If you prefer, you can set `useNativeAndroidPickerStyle` to false, which will also render an unstyled TextInput component. You can then pass down styles to customize it to your needs.

For either platform, you can alternatively pass down a child element of your choice that will be wrapped in a touchable area.

![iOS Example](./ex-ios.gif) ![Android Example](./ex-android.gif)

## [View examples on snack.expo.io](https://snack.expo.io/@lfkwtz/react-native-picker-select)

## Getting Started

### Installing

`npm install react-native-picker-select`

### Basic Usage

```js
import RNPickerSelect from 'react-native-picker-select';

export const Dropdown = () => {
    return (
        <RNPickerSelect
            onValueChange={(value) => console.log(value)}
            items={[
                { label: 'Football', value: 'football' },
                { label: 'Baseball', value: 'baseball' },
                { label: 'Hockey', value: 'hockey' },
            ]}
        />
    );
};
```

### Versioning

| Component | React   |
| --------- | ------- |
| >= 3.0.0  | >= 16.3 |
| < 3.0.0   | < 16.3  |

### Props

| Name                                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Details                  |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `onValueChange`                                 | Callback which returns `value, index`                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | **required**<br>function |
| `items`                                         | The items for the component to render<br> - Each item should be in the following format:<br>`{label: 'Orange', value: 'orange', key: 'orange', color: 'orange'}`<br>- The label and the value are required<br>- The key and color are optional<br>- The key will be set to the label if not included<br>- The value can be any data type                                                                                                                                                                | **required**<br>array    |
| `placeholder`                                   | - An override for the default placeholder object with a label of `Select an item...` and a value of `null`<br>- An empty object can be used if you'd like to disable the placeholder entirely                                                                                                                                                                                                                                                                                                           | object                   |
| `disabled`                                      | Disables interaction with the component                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | boolean                  |
| `value`                                         | Will attempt to locate a matching item from the `items` array by checking each item's `value` property. If found, it will update the component to show that item as selected. If the value is not found, it will default to the first item.                                                                                                                                                                                                                                                             | any                      |
| `itemKey`                                       | Will attempt to locate a matching item from the `items` array by checking each item's `key` property. If found, it will update the component to show that item as selected. If the key is not found, it will attempt to find a matching item by `value` as above.                                                                                                                                                                                                                                       | string, number           |
| `style`                                         | Style overrides for most parts of the component.<br>_More details in [styling](#styling)_                                                                                                                                                                                                                                                                                                                                                                                                               | object                   |
| `pickerProps`                                   | Additional props to pass to the Picker (some props are used in core functionality so use this carefully)                                                                                                                                                                                                                                                                                                                                                                                                | object                   |
| `Icon`                                          | Custom icon component to be rendered.<br>_More details in [styling](#styling)_                                                                                                                                                                                                                                                                                                                                                                                                                          | Component                |
| `textInputProps`                                | Additional props to pass to the TextInput (some props are used in core functionality so use this carefully). This is iOS only unless `useNativeAndroidPickerStyle={false}`.                                                                                                                                                                                                                                                                                                                             | object                   |
| `onOpen`<br>                                    | Callback triggered right before the opening of the picker<br>_Not supported when `useNativeAndroidPickerStyle={true}`_                                                                                                                                                                                                                                                                                                                                                                                    | function                 |
| `useNativeAndroidPickerStyle`<br>_Android only_ | The component defaults to using the native Android Picker in its un-selected state. Setting this flag to `false` will mimic the default iOS presentation where a tappable TextInput is displayed.<br>_More details in [styling](#styling)_                                                                                                                                                                                                                                                              | boolean                  |
| `InputAccessoryView`<br>_iOS only_              | Replace the InputAcessoryView section (bar with tabbing arrown and Done button) of the opened picker with your own custom component. Can also return `null` here to hide completely. While this bar is typical on `select` elements on the web, the [interface guidelines](https://developer.apple.com/ios/human-interface-guidelines/controls/pickers/) does not include it. View the [snack](https://snack.expo.io/@lfkwtz/react-native-picker-select) to see examples on how this can be customized. | boolean                  |
| `doneText`<br>_iOS only_                        | "Done" default text on the modal. Can be overwritten here                                                                                                                                                                                                                                                                                                                                                                                                                                               | string                   |
| `onUpArrow / onDownArrow`<br>_iOS only_         | Presence enables the corresponding arrow<br>- Closes the picker<br>- Calls the callback provided                                                                                                                                                                                                                                                                                                                                                                                                        | function                 |
| `onDonePress`<br>_iOS only_                     | Callback when the 'Done' button is pressed                                                                                                                                                                                                                                                                                                                                                                                                                                                              | function                 |
| `onClose`<br>_iOS only_                         | Callback triggered right before the closing of the picker                                                                                                                                                                                                                                                                                                                                                                                                                                               | function                 |
| `modalProps`<br>_iOS only_                      | Additional props to pass to the Modal (some props are used in core functionality so use this carefully)                                                                                                                                                                                                                                                                                                                                                                                                 | object                   |

### Styling

All properties mentioned below must be nested under the `style` prop. Examples of different styling options can be found [on the example snack](https://snack.expo.io/@lfkwtz/react-native-picker-select).

#### iOS-specific

-   The component wraps a TextInput without styling. You can target the TextInput styling with `inputIOS`.
-   Other styles that can be modified for iOS are named `inputIOSContainer`, `placeholder`, `viewContainer`, `chevronContainer`, `chevron`, `chevronUp`, `chevronDown`, `chevronActive`, `done`, `modalViewTop`, `modalViewMiddle`, and `modalViewBottom`

#### Android-specific

-   The native Picker in its inactive state acts looks similar to a TextInput, but it has limitations on custom styling. Any styling that is possible can be applied via `inputAndroid`.
-   You can add some styling customization to the active-state native Picker, [but that requires modifying some xml files](https://stackoverflow.com/a/39141949/1437023)
-   If you set the prop `useNativeAndroidPickerStyle` to false, the component will allow a few other style objects: `inputAndroidContainer`, `placeholder`, and `inputAndroid`
-   Other styles that can be modified for Android are named `headlessAndroidContainer` and `viewContainer`

### Icon

-   If a component is passed in via the `Icon` prop - it will be rendered with `{ position: 'absolute', right: 0 }` applied to its wrapping container. You can modify these values and add additional spacing to position the icon as needed by modifying `iconContainer`. You'll probably also want to add some `paddingRight` to your input styling to avoid any longer text appearing behind the icon.
-   You can pass a component of your choosing (css, image, svg, etc..) for use as the icon. For ease of use, consider a library such as [react-native-shapes](https://github.com/lfkwtz/react-native-shapes) or [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons).
-   Examples of different icons and their usage can be found [on the example snack](https://snack.expo.io/@lfkwtz/react-native-picker-select).

## Testing

This component has been tested on React Native v0.51 - v0.61

[![BrowserStack](https://i.imgur.com/cOdhMed.png)](https://www.browserstack.com/)

## License

react-native-picker-select is [MIT licensed](https://github.com/lawnstarter/react-native-picker-select/tree/master/LICENSE) and built with :heart: in Austin, TX by the team at [LawnStarter](https://lawnstarter.com)
