import { StyleSheet } from "react-native";

const GlobalStyles = StyleSheet.create({
    container : {
        flex: 1,
    },
    bgWhite : {
        backgroundColor: 'white'
    },
    bgBlue: {
        backgroundColor: '#1d9bf1',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    mr2: {
        marginRight: 2
    },

    mr1: {
        marginRight: 1
    },

    ml2: {
        marginLeft: 8
    },
    ml4: {
        marginLeft: 16
    },

    mt4: {
        marginTop: 16
    },
    mt5: {
        marginTop: 22
    },
    authImage: {width: 120, height: 120},
    textGray: {
        color: 'gray'
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    tweetName: {
        fontWeight: 'bold',
        color: '#222222',
    },
    tweetHandle: {
        marginHorizontal: 8,
        color: 'gray'
    },
    linkColor: {
        color: '#1d9bf1'
    },
    tweetSeparator: {
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
    },
    cameraContainer: {
        flex: 1,
        flexDirection: 'row'
    },

    fixedRatio: {
        flex: 1,
        aspectRatio: 1,
    }


});

export default GlobalStyles;