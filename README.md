
# React Native Select

A Picker component for React Native which emulates the native `<select>` interfaces for iOS and Android

For iOS, we are wrapping a TextInput component. You can pass down your custom styling to match your other inputs.

For Android, we are using the native Picker component, but adding a pseudo-underline to emulate a typical TextInput. Additional styling can be passed down also to further customize the appearance.

## Getting Started

### Installing

`npm install react-native-select`
or
`yarn add react-native-select`

### Usage

**Required Props**
* `onSelect` - function
  * Callback which returns an object in the structure of `{value, index}`
* `items` - array
  * The items for the component to render. Each item should be in the following format:
  * `{label: 'Red', value: 'red', key: 'red'}`
  * The label and the value are required, but the key will be based upon the label if it isn't included
  * The value can be any data type

**Optional Props**
* `placeholder` - string
  * An override for the default placeholder of `Select an item...`
* `hideDoneBar` - boolean
  * For the iOS component, hides the bar with tabbing arrows and Done link to exit the modal. While this is typical on `<select>` elements on the web, the [interface guidelines](https://developer.apple.com/ios/human-interface-guidelines/controls/pickers/) does not include it.
* `hideIcon` - boolean
  * For the iOS component, hides the floating downward arrow on the right side of the input box
* `disabled` - boolean
  * Disables interaction with the component
* `value` - any
  * Will attempt to locate a matching value from the `items` array by checking each item's `value` key. If found, it will update the component to show that item as selected. If the value is not found, it will default to the placeholder.
* `style` - object
  * Style overrides for most parts of the component. More details below.

This component has been tested on React Native v0.51

<!--## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/lfkwtz/react-native-select/tags).

## Authors

* **Michael Lefkowitz** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/lfkwtz/react-native-select/contributors) who participated in this project.-->

## Future Plans

[ ] Enable component to run headless and wrap the tap area of a child component
[ ] Update Android picker to look closer to platform's `<select>`
[ ] Allow Android picker to toggle between

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
