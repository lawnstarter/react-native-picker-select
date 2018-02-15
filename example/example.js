import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      favColor: '',
    };
  }

  // if the component is using the optional `value` prop, the parent
  // has the abililty to both set the initial value and also update it
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        favColor: 'red',
      });
    }, 1000);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>What&rsquo;s your favorite color?</Text>
        <RNPickerSelect
          placeholder={{
            label: 'Select a color...',
            value: null,
          }}
          items={[
          {
            label: 'Red',
            value: 'red',
          },
          {
            label: 'Orange',
            value: 'orange',
          },
          {
            label: 'Blue',
            value: 'blue',
          },
        ]}
          onSelect={
          (item) => {
            this.setState({
              favColor: item.value,
            });
           }
        }
          style={{ ...pickerSelectStyles }}
          value={this.state.favColor}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
  },
});
