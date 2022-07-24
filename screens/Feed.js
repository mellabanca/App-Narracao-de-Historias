import React, { Component } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Image, StatusBar, Platform } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import StoryCard from "./StoryCard";
import firebase from "firebase";

//let stories = require("./temp.json")

let customFonts = {
  'Bubblegum-Sans': require("../assets/fonts/BubblegumSans-Regular.ttf"),
}

export default class Feed extends Component {
  constructor(props){
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme: true,
      stories: []
    }
  }

  async _loadFontsAsync(){
    await Font.loadAsync(customFonts);
    this.setState({fontsLoaded: true});
  }

  componentDidMount(){
    this._loadFontsAsync();
    this.fetchUser();
    this.fetchStories();
  }

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", snapshot => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === "light" });
      });
  };

  fetchStories = () => {
    firebase
      .database()
      .ref("/posts/")
      .on("value", snapshot => {
          let stories = [];
          if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach(function(key) {
              stories.push({
                key: key,
                value: snapshot.val()[key]
              });
            });
          }
          this.setState({ stories: stories });
          this.props.setUpdateToFalse()
        },
        function (errorObject) {
          console.log("A leitura falhou: " + errorObject.code);
        }
      );
  };

  renderItem = ({item: story}) => {
    return <StoryCard story={story} navigation={this.props.navigation}/>
  }

  keyExtractor = (item, index) => index.toString();

    render() {
      if(!this.state.fontsLoaded){
        return <AppLoading/>;
      }
      else {
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
              {
                !this.state.stories[0] ?
                <View style={styles.noStories}>
                  <Text style={this.state.light_theme ? styles.noStoriesTextLight : styles.noStoriesText}>
                    Nenhuma história disponível
                  </Text>
                </View>
                : <View style={styles.cardContainer}>
                <FlatList
                  keyExtractor={this.keyExtractor}
                  data={this.state.stories}
                  renderItem={this.renderItem}
                />
              </View>
              }
            </View>
        )
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
    backgroundColor: "white"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row",
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  imageLogo:{
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center",
  },
  appTitleText: {
    color: "white",
    fontSize: 20,
    fontFamily: "Bubblegum-Sans",
  },
  appTitleTextLight: {
    color: "#15193c",
    fontSize: 20,
    fontFamily: "Bubblegum-Sans",
  },
  cardContainer: {
    flex: 0.93
  },
  noStories:{
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center",
  },
  noStoriesText: {
     color: "white",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
  },
  noStoriesTextLight: {
    color: "#15193c",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
  }
})