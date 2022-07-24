import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Dimensions
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class StoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea}/>
            <View style={styles.cardContainer}>
                <Image source={require("../assets/story_image_1.png")}
                       style={{
                        resizeMode:"contain",
                        width: Dimensions.get("window").width-45,
                        height: 250,
                        borderRadius: 10
                       }}></Image>
              <View style={styles.titleContainer}>
                <View style={styles.titleTextContainer}>
                  <View style={styles.storyTitle}>
                    <Text style={styles.storyTitleText}>
                    {this.props.story.title}
                    </Text>
                  </View>
                  <View style={styles.storyAuthor}>
                    <Text style={styles.storyAuthorText}>
                      {this.props.story.author}
                    </Text>
                  </View>
                </View>
              </View>
                <Text style={styles.descriptionText}>
                {this.props.story.description}
                </Text>
              <View style={styles.actionContainer}>
                <View style={styles.likeButton}>
                  <View style={styles.likeIcon}>
                    <Ionicons name={"heart"}
                              size={30}
                              color={"white"}
                              style={{width: 30,
                                      marginLeft: 20,
                                      marginTop: 5}}
                    />
                    </View>
                    <View>
                      <Text style={styles.likeText}>12k</Text>
                    </View>
                  </View>
                </View>
              </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
   droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  cardContainer: {
    margin: 13,
    backgroundColor: "#2f345d",
    borderRadius: 20,
    padding: 10
  },
  titleTextContainer: {
    flex: 1
  },
  titleContainer: {
    paddingLeft: 10,
    justifyContent: "center"
  },
  storyTitleText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 20,
    color: "white"
  },
  storyAuthorText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 18,
    color: "white"
  },
  descriptionText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 13,
    color: "white",
    padding: 10,
  },
  actionContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  likeButton: {
    backgroundColor: "#eb3948",
    borderRadius: 30,
    width: 160,
    height: 40,
    flexDirection: "row",
    paddingLeft: 25,
    alignItems: "center",
  },
  likeText: {
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: 25,
    marginLeft: 5,
    marginTop: 6,
  }
});