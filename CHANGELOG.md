# Changelog

## [9.3.1](https://github.com/lawnstarter/react-native-picker-select/compare/v9.3.0...v9.3.1) (2024-08-12)


### Bug Fixes

* **types:** add prop testID to index.d.ts ([#605](https://github.com/lawnstarter/react-native-picker-select/issues/605)) ([3fbe1cf](https://github.com/lawnstarter/react-native-picker-select/commit/3fbe1cfa7681988bc6edb1f020be726c76269041))

## [9.3.0](https://github.com/lawnstarter/react-native-picker-select/compare/v9.2.0...v9.3.0) (2024-08-12)


### Features

* apply custom styling to active dropdown item ([#609](https://github.com/lawnstarter/react-native-picker-select/issues/609)) ([4626a4e](https://github.com/lawnstarter/react-native-picker-select/commit/4626a4e595c2143020771dbb2fc7838dee8daa83)), closes [#608](https://github.com/lawnstarter/react-native-picker-select/issues/608)

## [9.2.0](https://github.com/lawnstarter/react-native-picker-select/compare/v9.1.3...v9.2.0) (2024-07-26)


### Features

* add prop dropdownItemStyle ([#600](https://github.com/lawnstarter/react-native-picker-select/issues/600)) ([b5f19ad](https://github.com/lawnstarter/react-native-picker-select/commit/b5f19ad02a7cb06d00dd681f54358d2a21712262))

## [9.1.3](https://github.com/lawnstarter/react-native-picker-select/compare/v9.1.2...v9.1.3) (2024-04-01)


### Documentation

* **readme:** update README.md ([#331](https://github.com/lawnstarter/react-native-picker-select/issues/331)) ([36bca74](https://github.com/lawnstarter/react-native-picker-select/commit/36bca74fecaa66bcf17b65a360e423db692c3f13))

## [9.1.2](https://github.com/lawnstarter/react-native-picker-select/compare/v9.1.1...v9.1.2) (2024-04-01)


### Bug Fixes

* **types:** missing type definition for 'donePressed' parameter in 'onClose' callback ([#545](https://github.com/lawnstarter/react-native-picker-select/issues/545)) ([d39f880](https://github.com/lawnstarter/react-native-picker-select/commit/d39f880d1d866a81a84b5b1dd70e00f6001a3572))

## [9.1.1](https://github.com/lawnstarter/react-native-picker-select/compare/v9.1.0...v9.1.1) (2024-03-29)

### Build System

- **package:** release 9.1.1 ([f7c7646](https://github.com/lawnstarter/react-native-picker-select/commit/f7c764608f58598422b92fee19d3a96e5124c508))

## 9.1.0

##### Bugfix

- Improve comparison in getSelectedItem (#543)

## 9.0.1

##### Bugfix

- Correct types for PickerStyle interface (#528)
- Fix Icon prop type (#529)

## 9.0.0

##### Breaking Changes

- Moved `react-native-picker` to peerDependencies and upgraded to ^2.4.0 (#523)

---

## 8.1.0

##### New

- Dark mode support (#513)
- donePressed on onClose callback (#319)
- testID available on each item (#498)

##### Bugfix

- Fixed reliance on now-private dep (#513)

---

## 8.0.4

##### Bugfix

- Moved dep to @react-native-picker/picker

---

## 8.0.3

##### Bugfix

- Fix `Cannot update component inside function` error (#346)

---

## 8.0.2

##### Bugfix

- Add `fixAndroidTouchableBug` prop (#354)

---

## 8.0.1

##### Bugfix

- Locked @react-native-community/picker to 1.6.0 to fix Expo issues
- Add togglePicker method to Picker component typescript definition (#360)
- Fix wrong PickerProps import in index.d.ts (#352)
- Fixed inputWeb to be a TextStyle, not ViewStyle (#365)

---

## 8.0.0

##### Breaking Changes

- Now using [@react-native-community/picker](https://github.com/react-native-community/react-native-picker#readme) under the hood (#340). For that reason, this library now requires React Native 0.60 or above. If using Expo, SDK38 or above is required.
- Replaced item prop `displayValue` with `inputLabel` (#336)

##### New

- Added web support (#316)

---

## 7.0.0

##### Breaking Changes

- Deprecated prop `hideDoneBar` has been removed
- Deprecated prop `placeholderTextColor` has been removed
- Type definitions rewritten (#305)

##### Chore

- Remove deprecated ColorPropType

---

### 6.6.0

##### New

- Updated touchables to all be all TouchableOpacity (with override props available)
- Done text now animates on depress like native select dialog (#215)

---

### 6.5.1

##### Bugfix

- Update iOS colors (#281)

---

### 6.5.0

##### New

- If an item has the `displayValue` property set to true, the TextInput shows the item `value` instead of the item `label` (#279)

---

### 6.4.0

##### New

- Opened up `onOpen` prop to now support Android when in headless or `useNativeAndroidPickerStyle={false}` mode

---

### 6.3.4

##### Bugfix

- Fix for `onDonePress` regression (#236)
- "Done" Text element now set to `allowFontScaling={false}` (#247)

---

### 6.3.3

##### Chore

- Split off styles into separate file

---

### 6.3.2

##### Bugfix

- Update typescript definition file to add `InputAccessoryView`

---

### 6.3.1

##### Bugfix

- Fix Done button on iPad (#209)

---

### 6.3.0

##### New

- Added a prop called `InputAccessoryView` to allow a custom component to replace the InputAccessoryView on iOS. View the [snack](https://snack.expo.io/@lfkwtz/react-native-picker-select) to see examples on how this can be customized. As a result of this change, the `hideDoneBar` prop has been deprecated.
- iOS modal window now correctly resizes on orientation change
- `defaultStyles` are now exported

---

### 6.2.0

##### New

- Supports an empty `items` array (#161)

---

### 6.1.1

##### Bugfix

- Replaced setTimeouts with callbacks for arrow buttons (#177)

---

### 6.1.0

##### New

- Opened up `placeholder` on style object for modification (#119) (#155). The `placeholderTextColor` prop is now deprecated, as this style object allows for additional properties.

---

## 6.0.0

#### Breaking Changes

- In order to make this component less opinionated, especially in terms of style, we have removed the default dropdown arrow icon in leiu of a more flexible `Icon` prop which will render a component - allowing you to insert your own css, image, svg, or icon from any library of your choosing. Due to this change, the `noIcon` prop has been removed. To replicate the arrow from previous versions, see the [last example](example/example.js) / see the styling section in the README for more details.
- In Android, we no longer insert a psuedo-underline by default - as the default input style in React Native sets the underline color to transparent since [this PR](https://github.com/facebook/react-native/commit/a3a98eb1c7fa0054a236d45421393874ce8ce558) - which landed in 0.56. You can add this back in fairly easily, either by using the `textInputProps` prop or by adding a border on one of the wrapping container elements - all depending on your personal usage of the component.
- Some of the default styles of the iOS "Done bar" have been tweaked and streamlined
- if using useNativeAndroidPickerStyle={false}, the outer container is now only `headlessAndroidContainer` without `viewContainer` wrapping it

---

### 5.2.5

##### Bugfix

- Fix headless Android onValueChange trigger on render (#141)

---

### 5.2.4

#### Bugfix

- Fix TypeError (#139)

---

### 5.2.3

##### Bugfix

- Fixes Android headless mode trigger area (#122)

---

### 5.2.2

##### Bugfix

- Fixes unnecessary renders (#129)

---

### 5.2.1

##### Bugfix

- Fixes keyboard not dismissing on iOS

---

### 5.2.0

##### New

- Added `onOpen` and `onClose` callbacks (iOS only)

---

### 5.1.1

##### New

- Opened up headlessAndroidPicker and chevronContainer on style object for modification

---

### 5.1.0

##### New

- Added `useNativeAndroidPickerStyle` prop. See README for more details.

##### Bugfix

- Fixed Android headless mode showing selected value outside of View (#83)

---

### 5.0.1

##### Bugfix

- Fixed `TouchableWithoutFeedback` warning

---

## 5.0.0

#### Breaking Changes

- `styles.placeholderColor` has been replaced with `placeholderTextColor`
- `mode` prop is now accessible via `pickerProps`
- `animationType` prop is now accessible via `modalProps` (see warning in README)

##### New

- Default placeholder now includes default `color` of #9EA0A4
- `pickerProps`, `modalProps`, and `textInputProps` have been added (see README)
