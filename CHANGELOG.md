### v5.1.1

##### New

-   Opened up headlessAndroidPicker and chevronContainer on style object for modification

### v5.1.0

##### New

-   Added `useNativeAndroidPickerStyle` prop. See README for more details.

##### Bugfix

-   Fixed Android headless mode showing selected value outside of View (#83)

### v5.0.1

##### Bugfix

-   Fixed `TouchableWithoutFeedback` warning

### v5.0.0

##### Breaking Changes

-   `styles.placeholderColor` has been replaced with `placeholderTextColor`
-   `mode` prop is now accessible via `pickerProps`
-   `animationType` prop is now accessible via `modalProps` (see warning in README)

##### New

-   Default placeholder now includes default `color` of #9EA0A4
-   `pickerProps`, `modalProps`, and `textInputProps` have been added (see README)
