import React, { Component } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Image, StatusBar, Platform } from 'react-native';
import { FlatList } from "react-native-gesture-handler";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import StoryCard from "./StoryCard";

let stories = require("./temp.json")

let customFonts = {
  'Bubblegum-Sans': require("../assets/fonts/BubblegumSans-Regular.ttf"),
}

export default class Feed extends Component {
  constructor(props){
    super(props);
    this.state = {
      fontsLoaded: false,
    }
  }

  async _loadFontsAsync(){
    await Font.loadAsync(customFonts);
    this.setState({fontsLoaded: true});
  }

  componentDidMount(){
    this._loadFontsAsync();
  }

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
            <View style={styles.container}>
            <SafeAreaView style={styles.droidSafeArea}/>
              <View style={styles.appTitle}>
                <View style={styles.appIcon}>
                <Image source={require("../assets/logo.png")}
                       style={styles.imageLogo}></Image>
                </View>
                  <View style={styles.appTitleTextContainer}>
                    <Text style={styles.appTitleText}>App Narração de Histórias</Text>
                  </View>
              </View>
              <View style={styles.cardContainer}>
                <FlatList
                  keyExtractor={this.keyExtractor}
                  data={stories}
                  renderItem={this.renderItem}
                />
              </View>
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
  cardContainer: {
    flex: 0.93
  }
})