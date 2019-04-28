import React, { Component } from 'react';
import Menu from './MenuComponent';
import { DISHES } from '../shared/dishes';
import DishDetail from './DishDetailComponent';
import { View, Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';

const MenuNavigator = createStackNavigator({
    Menu: { screen: Menu },
    DishDetail: { screen: DishDetail }
}, {
    initialRouteName: 'Menu',
    navigationOptions: {
        headerStyle: {
            backgroundColor: '#512DA8'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            color: '#fff'
        }
    }
})

class Main extends Component {

    render() {
        const padVal = Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight;
        return(
            <View style={{ flex: 1, paddingTop: padVal }}>
                <MenuNavigator />
            </View>
        )
    }
}

export default Main;