/**
 * @format
 */
import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import App from './src/App';
import './src/utils/storage';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
