import React, { Component } from "react";
import { StyleSheet, Text, View, Switch, SafeAreaView, Image, Platform, StatusBar } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

import firebase from "firebase";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      isEnabled: false,
      light_theme: true,
      profile_image: "",
      name: ""
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  async fetchUser(){
    var theme, name, image;
    await firebase
          .database()
          .ref("/users/" + firebase.auth().currentUser.uid)
          .on("value", data => {
            var snapshot = data.val()
            theme = snapshot.current_theme
            name = `${snapshot.first_name} ${snapshot.last_name}`
            image = snapshot.profile_picture;
          })
          this.setState({
            light_theme: theme === "light" ? true : false,
            isEnabled: theme === "light" ? false : true,
            name: name,
            profile_image: image
          })
  }

  toggleSwitch() {
    const previous_state = this.state.isEnabled;
    const theme = !this.state.isEnabled ? "dark" : "light";
    var updates = {};
    updates[
      "/users/" + firebase.auth().currentUser.uid + "/current_theme"
    ] = theme;
    firebase
      .database()
      .ref()
      .update(updates);
    this.setState({ isEnabled: !previous_state, light_theme: previous_state });
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />
    } else {
      return (
        <View style={this.state.light_theme ? styles.containerLight : styles.container}>
          <SafeAreaView style={styles.droidSafeArea}/>
            <View style={styles.appTitle}>
              <View style={styles.appIcon}>
              <Image source={require("../assets/logo.png")}
                       style={styles.imageLogo}></Image>
              </View>
              <View style={styles.appTitleTextContainer}>
                <Text style={this.state.light_theme ? styles.appTitleTextLight : styles.appTitleText}>App Narração de Histórias</Text>
              </View>
            </View>
            <View style={styles.screenContainer}>
              <View style={styles.profileImageContainer}>
                <Image source={{uri: this.state.profile_image}}
                       style={styles.profileImage}></Image>
                <Text style={this.state.light_theme ? styles.nameTextLight : styles.nameText}>{this.state.name}</Text>
              </View>
              <View style={styles.themeContainer}>
                <Text style={this.state.light_theme ? styles.themeTextLight : styles.themeText}>Tema Escuro</Text>
                <Switch style={{transform: [{scaleX: 1.3},{scaleY: 1.3}]}}
                        trackColor={{false:"#767577",true: this.state.light_theme ? "#eee" : "white"}}
                        thumbColor={this.state.isEnabled ? "#ee8249" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={()=>this.toggleSwitch()}
                        value={this.state.isEnabled}
                />
              </View>
            <View style={{flex: 0.3}}/>
          </View>
          <View style={{flex: 0.08}}/>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  containerLight: {
    flex: 1,
    backgroundColor: "white",
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  imageLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(20),
    fontFamily: "Bubblegum-Sans"
  },
  appTitleTextLight: {
    color: "#15193c",
    fontSize: RFValue(20),
    fontFamily: "Bubblegum-Sans"
  },
  screenContainer: {
    flex: 0.85
  },
  profileImageContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  profileImage: {
    width: RFValue(140),
    height: RFValue(140),
    borderRadius: RFValue(70)
  },
  nameText: {
    color: "white",
    fontSize: RFValue(30),
    fontFamily: "Bubblegum-Sans",
    marginTop: RFValue(10)
  },
  nameTextLight: {
    color: "#15193c",
    fontSize: RFValue(30),
    fontFamily: "Bubblegum-Sans",
    marginTop: RFValue(10)
  },
  themeContainer: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: RFValue(20)
  },
  themeText: {
    color: "white",
    fontSize: RFValue(30),
    fontFamily: "Bubblegum-Sans",
    marginRight: RFValue(15)
  },
  themeTextLight: {
    color: "#15193c",
    fontSize: RFValue(30),
    fontFamily: "Bubblegum-Sans",
    marginRight: RFValue(15)
  }
});