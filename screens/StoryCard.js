import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class StoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme: true,
      story_id: this.props.story.key,
      story_data: this.props.story.value,
      is_liked: false,
      likes: this.props.story.value.likes,
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

  likeAction = () => {
    if(this.state.is_liked){
      firebase.database()
      .ref("posts")
      .child(this.state.story_id)
      .child("likes")
      .set(firebase.database.ServerValue.increment(-1))
      this.setState({likes: (this.state.likes -= 1), is_liked: false})
    } else {
      firebase.database()
      .ref("posts")
      .child(this.state.story_id)
      .child("likes")
      .set(firebase.database.ServerValue.increment(1))
      this.setState({likes: (this.state.likes += 1), is_liked: true})
    }
  }

  render() {
    var story = this.state.story_data;
    var storyId = this.state.story_id;
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
        let images = {
        image_1: require("../assets/story_image_1.png"),
        image_2: require("../assets/story_image_2.png"),
        image_3: require("../assets/story_image_3.png"),
        image_4: require("../assets/story_image_4.png"),
        image_5: require("../assets/story_image_5.png")
      }
      return (
        <TouchableOpacity style={styles.container}
                          onPress={()=>this.props.navigation.navigate(
                            "Tela de Histórias", {story: this.state.story_data, storyId: this.state.story_id}
                          )}>
          <SafeAreaView style={styles.droidSafeArea}/>
            <View style={this.state.light_theme ? styles.cardContainerLight : styles.cardContainer}>
              <Image source={images[story.preview_image]}
                       style={{
                        resizeMode:"contain",
                        width: Dimensions.get("window").width-45,
                        height: 250,
                        borderRadius: 10
                       }}></Image>
              <View style={styles.titleContainer}>
                <View style={styles.titleTextContainer}>
                  <View style={styles.storyTitle}>
                    <Text style={this.state.light_theme ? styles.storyTitleTextLight : styles.storyTitleText}>
                    {story.title}
                    </Text>
                  </View>
                  <View style={styles.storyAuthor}>
                    <Text style={this.state.light_theme ? styles.storyAuthorTextLight : styles.storyAuthorText}>
                      {story.author}
                    </Text>
                  </View>
                </View>
              </View>
                <Text style={this.state.light_theme ? styles.descriptionTextLight : styles.descriptionText}>
                  {story.description}
                </Text>
              <View style={styles.actionContainer}>
              <TouchableOpacity onPress={() => this.likeAction()}>
                <View style={this.state.is_liked ? styles.likeButtonLiked : styles.likeButtonDisliked}>
                  <View style={styles.likeIcon}>
                    <Ionicons name={"heart"}
                              size={30}
                              color={this.state.light_theme ? "#2f345d" : "white"}
                              style={{width: 30,
                                      marginLeft: 20,
                                      marginTop: 5}}
                    />
                    </View>
                    <View>
                      <Text style={this.state.light_theme ? styles.likeTextLight : styles.likeText}>{this.state.likes}</Text>
                    </View>
                  </View>
                  </TouchableOpacity>
                </View>
              </View>
        </TouchableOpacity>
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
    cardContainerLight: {
    margin: 13,
    backgroundColor: "#f2f2f2",
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
  storyTitleTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 20,
    color: "#2f345d"
  },
  storyAuthorText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 18,
    color: "white"
  },
  storyAuthorTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 18,
    color: "#2f345d"
  },
  descriptionText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 13,
    color: "white",
    padding: 10,
  },
   descriptionTextLight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 13,
    color: "#2f345d",
    padding: 10,
  },
  actionContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  likeButtonLiked: {
    backgroundColor: "#eb3948",
    borderRadius: 30,
    width: 160,
    height: 40,
    flexDirection: "row",
    paddingLeft: 25,
    alignItems: "center",
  },
  likeButtonDisliked: {
    borderColor: "#eb3948",
    borderRadius: 30,
    borderWidth: 2,
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
  },
   likeTextLight: {
    color: "#2f345d",
    fontFamily: "Bubblegum-Sans",
    fontSize: 25,
    marginLeft: 5,
    marginTop: 6,
  }
});