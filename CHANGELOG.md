### 6.4.0

##### New

-   Opened up `onOpen` prop to now support Android when in headless or `useNativeAndroidPickerStyle={false}` mode

---

### 6.3.4

##### Bugfix

-   Fix for `onDonePress` regression (#236)
-   "Done" Text element now set to `allowFontScaling={false}` (#247)

---

### 6.3.3

##### Chore

-   Split off styles into separate file

---

### 6.3.2

##### Bugfix

-   Update typescript definition file to add `InputAccessoryView`

---

### 6.3.1

##### Bugfix

-   Fix Done button on iPad (#209)

---

### 6.3.0

##### New

-   Added a prop called `InputAccessoryView` to allow a custom component to replace the InputAccessoryView on iOS. View the [snack](https://snack.expo.io/@lfkwtz/react-native-picker-select) to see examples on how this can be customized. As a result of this change, the `hideDoneBar` prop has been deprecated.
-   iOS modal window now correctly resizes on orientation change
-   `defaultStyles` are now exported

---

### 6.2.0

##### New

-   Supports an empty `items` array (#161)

---

### 6.1.1

##### Bugfix

-   Replaced setTimeouts with callbacks for arrow buttons (#177)

---

### 6.1.0

##### New

-   Opened up `placeholder` on style object for modification (#119) (#155). The `placeholderTextColor` prop is now deprecated, as this style object allows for additional properties.

---

## 6.0.0

#### Breaking Changes

-   In order to make this component less opinionated, especially in terms of style, we have removed the default dropdown arrow icon in leiu of a more flexible `Icon` prop which will render a component - allowing you to insert your own css, image, svg, or icon from any library of your choosing. Due to this change, the `noIcon` prop has been removed. To replicate the arrow from previous versions, see the [last example](example/example.js) / see the styling section in the README for more details.
-   In Android, we no longer insert a psuedo-underline by default - as the default input style in React Native sets the underline color to transparent since [this PR](https://github.com/facebook/react-native/commit/a3a98eb1c7fa0054a236d45421393874ce8ce558) - which landed in 0.56. You can add this back in fairly easily, either by using the `textInputProps` prop or by adding a border on one of the wrapping container elements - all depending on your personal usage of the component.
-   Some of the default styles of the iOS "Done bar" have been tweaked and streamlined
-   if using useNativeAndroidPickerStyle={false}, the outer container is now only `headlessAndroidContainer` without `viewContainer` wrapping it

---

### 5.2.5

##### Bugfix

-   Fix headless Android onValueChange trigger on render (#141)

---

### 5.2.4

#### Bugfix

-   Fix TypeError (#139)

---

### 5.2.3

##### Bugfix

-   Fixes Android headless mode trigger area (#122)

---

### 5.2.2

##### Bugfix

-   Fixes unnecessary renders (#129)

---

### 5.2.1

##### Bugfix

-   Fixes keyboard not dismissing on iOS

---

### 5.2.0

##### New

-   Added `onOpen` and `onClose` callbacks (iOS only)

---

### 5.1.1

##### New

-   Opened up headlessAndroidPicker and chevronContainer on style object for modification

---

### 5.1.0

##### New

-   Added `useNativeAndroidPickerStyle` prop. See README for more details.

##### Bugfix

-   Fixed Android headless mode showing selected value outside of View (#83)

---

### 5.0.1

##### Bugfix

-   Fixed `TouchableWithoutFeedback` warning

---

## 5.0.0

#### Breaking Changes

-   `styles.placeholderColor` has been replaced with `placeholderTextColor`
-   `mode` prop is now accessible via `pickerProps`
-   `animationType` prop is now accessible via `modalProps` (see warning in README)

##### New

-   Default placeholder now includes default `color` of #9EA0A4
-   `pickerProps`, `modalProps`, and `textInputProps` have been added (see README)
