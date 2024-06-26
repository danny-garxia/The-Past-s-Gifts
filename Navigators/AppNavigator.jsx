// MainTabs.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Assuming you are using Expo for icons
import ProfileSett from '../screens/ProfileSett';
import Friends from '../screens/Friends';
import Message from '../screens/Message';
import Post from '../screens/Post';
import Home from '../screens/Home';
import EncryptImage from '../encrypt';
const Tab = createBottomTabNavigator();

const AppNav = () => {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: '#cbae73',
                inactiveTintColor: 'gray',
                labelStyle: { display: 'none' }, // Hide the tab bar label

            }}
        >
            <Tab.Screen
                name="Home"
                component={EncryptImage}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" color={color} size={size} />
                    ),
                    headerShown: false, 
                }}
            />
    
            <Tab.Screen
                name="Message"
                component={Message}
                options={{
                    tabBarLabel: 'Message',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Post"
                component={Post}
                options={{
                    tabBarLabel: 'Post',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle-outline" color={color} size={size} />
                    ),
                    headerShown: false, 
                }}
            />
             <Tab.Screen
                name="Friends"
                component={Friends}
                options={{
                    tabBarLabel: 'Friends',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people-outline" color={color} size={size} />
                    ),
                }}
            /> 
             <Tab.Screen
                name="Profile"
                component={ProfileSett}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" color={color} size={size} />
                    ), 
                    headerShown: false, 
                }}
            />
            
            
        </Tab.Navigator>
    );
};

export default AppNav;
