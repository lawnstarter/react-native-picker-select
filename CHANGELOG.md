### v5.2.5

##### Bugfix

-   Fix headless Android onValueChange trigger on render (#141)

### v5.2.4

##### Bugfix

-   Fix TypeError (#139)

### v5.2.3

##### Bugfix

-   Fixes Android headless mode trigger area (#122)

### v5.2.2

##### Bugfix

-   Fixes unnecessary renders (#129)

### v5.2.1

##### Bugfix

-   Fixes keyboard not dismissing on iOS

### v5.2.0

##### New

-   Added `onOpen` and `onClose` callbacks (iOS only)

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
