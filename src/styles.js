import { StyleSheet } from 'react-native';

export const defaultStyles = StyleSheet.create({
    viewContainer: {
        alignSelf: 'stretch',
    },
    iconContainer: {
        position: 'absolute',
        right: 0,
    },
    modalViewTop: {
        flex: 1,
    },
    modalViewMiddle: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#f8f8f8',
        borderTopWidth: 1,
        borderTopColor: '#dedede',
        zIndex: 2,
    },
    chevronContainer: {
        flexDirection: 'row',
    },
    chevron: {
        width: 15,
        height: 15,
        backgroundColor: 'transparent',
        borderColor: '#a1a1a1',
        borderTopWidth: 1.5,
        borderRightWidth: 1.5,
    },
    chevronUp: {
        marginLeft: 11,
        transform: [{ translateY: 4 }, { rotate: '-45deg' }],
    },
    chevronDown: {
        marginLeft: 22,
        transform: [{ translateY: -5 }, { rotate: '135deg' }],
    },
    chevronActive: {
        borderColor: '#007aff',
    },
    done: {
        color: '#007aff',
        fontWeight: '600',
        fontSize: 17,
        paddingTop: 1,
        paddingRight: 11,
    },
    doneDepressed: {
        fontSize: 19,
    },
    modalViewBottom: {
        justifyContent: 'center',
        backgroundColor: '#d0d4da',
    },
    placeholder: {
        color: '#c7c7cd',
    },
    headlessAndroidPicker: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        color: 'transparent',
        opacity: 0,
    },
});
