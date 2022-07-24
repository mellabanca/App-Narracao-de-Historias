import React, {Component} from "react";
import { Text, View } from "react-native";
import firebase from "firebase";
import DashboardScreen from "./DashboardScreen";
import LoginScreen from "./LoadingScreen";

export default class Logout extends Component {
  componentDidMount(){
    firebase.auth().signOut();
  }

  render(){
    return(
      <LoginScreen/>
    )
  }
}
