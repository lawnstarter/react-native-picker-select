## 6.0.0

#### Breaking Changes

-   In order to make this component less opinionated, especially in terms of style, we have removed the default dropdown arrow icon in leiu of a more flexible `Icon` prop which will render a component - allowing you to insert your own css, image, svg, or icon from any library of your choosing. Due to this change, the `noIcon` prop has been removed. To replicate the arrow from previous versions, see the [last example](example/example.js) / see the styling section in the README for more details.
-   In Android, we no longer insert a psuedo-underline by default - as the default input style in React Native sets the underline color to transparent since [this PR](https://github.com/facebook/react-native/commit/a3a98eb1c7fa0054a236d45421393874ce8ce558) - which landed in 0.56. You can add this back in fairly easily, either by using the `textInputProps` prop or by adding a border on one of the wrapping container elements - all depending on your personal usage of the component.
-   Some of the default styles of the iOS "Done bar" have been tweaked and streamlined
-   if using useNativeAndroidPickerStyle={false}, the outer container is now only `headlessAndroidContainer` without `viewContainer` wrapping it

---

### v5.2.5

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
