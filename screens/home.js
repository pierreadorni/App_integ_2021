import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  ScrollView,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";

class Home extends React.Component {
  state = {
    pageName: "Journee",
    events: [],
    zoom: -1,
    isLoading: true,
  };
  specialZooms = {
    tuc: () => {
      return this._displayTUC();
    },
  };

  async _getPlanning() {
    let res = await fetch(
      "https://assos.utc.fr/integ/integ2021/api/get-planning.php"
    );
    res = await res.json();
    res.forEach((event) => {
      event.latitude = parseFloat(event.latitude);
      event.longitude = parseFloat(event.longitude);
    });

    this.setState({
      events: res,
    });
  }

  _displayTUC() {
    return (
      <ScrollView style={styles.zoomed} showsVerticalScrollIndicator={false}>
        <View style={styles.zoomedEvent}>
          <ImageBackground
            style={styles.zoomedImg}
            source={{ uri: this.state.events[this.state.zoom].img }}
          >
            <LinearGradient
              colors={["rgba(18,18,18,0)", "rgba(18,18,18,0.76)"]}
              style={styles.overlay}
            >
              <View style={styles.zoomedBottom}>
                <TouchableOpacity
                  style={styles.leave}
                  onPress={() => this.setState({ zoom: -1 })}
                >
                  <Image
                    source={require("../assets/cross.png")}
                    style={styles.cross}
                  />
                </TouchableOpacity>
                <View style={styles.dateBtn}>
                  <Text style={styles.day}>
                    {this.state.events[this.state.zoom].day}
                  </Text>
                  <Text style={styles.month}>
                    {this.state.events[this.state.zoom].month}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
          <View style={styles.zoomedMain}>
            <View style={styles.location}>
              <Image
                source={require("../assets/location.png")}
                style={styles.locationIcon}
              />
              <Text style={styles.locationText}>
                {this.state.events[this.state.zoom].location}
              </Text>
            </View>
            <Text style={styles.title}>
              {this.state.events[this.state.zoom].title}
            </Text>
            <Text style={styles.hours}>
              {this.state.events[this.state.zoom].hours}
            </Text>

            <Text style={styles.about}>À propos</Text>
            <Text style={styles.description}>
              {this.state.events[this.state.zoom].description}
            </Text>

            <Text style={styles.about}>Autre</Text>
            <MapView
              initialRegion={{
                latitude: this.state.events[this.state.zoom].latitude,
                longitude: this.state.events[this.state.zoom].longitude,
                latitudeDelta: 0.0152,
                longitudeDelta: 0.0151,
              }}
              style={styles.map}
            >
              <Marker
                coordinate={{
                  latitude: this.state.events[this.state.zoom].latitude,
                  longitude: this.state.events[this.state.zoom].longitude,
                }}
                title={this.state.events[this.state.zoom].title}
              />
            </MapView>
          </View>
          <View style={{ paddingBottom: 100 }}></View>
        </View>
      </ScrollView>
    );
  }

  _getEventById(id) {
    this.state.events.forEach((event) => {
      if (event.id == id) {
        return event;
      }
    });
  }

  _displayInfos() {
    if (this.state.zoom != -1) {
      const event = this.state.events[this.state.zoom];
      if (event.id in this.specialZooms) {
        return this.specialZooms[event.id]();
      } else {
        return (
          <ScrollView
            style={styles.zoomed}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.zoomedEvent}>
              <ImageBackground
                style={styles.zoomedImg}
                source={{uri:this.state.events[this.state.zoom].img}}
              >
                <LinearGradient
                  colors={["rgba(18,18,18,0)", "rgba(18,18,18,0.76)"]}
                  style={styles.overlay}
                >
                  <View style={styles.zoomedBottom}>
                    <TouchableOpacity
                      style={styles.leave}
                      onPress={() => this.setState({ zoom: -1 })}
                    >
                      <Image
                        source={require("../assets/cross.png")}
                        style={styles.cross}
                      />
                    </TouchableOpacity>
                    <View style={styles.dateBtn}>
                      <Text style={styles.day}>
                        {this.state.events[this.state.zoom].day}
                      </Text>
                      <Text style={styles.month}>
                        {this.state.events[this.state.zoom].month}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
              <View style={styles.zoomedMain}>
                <View style={styles.location}>
                  <Image
                    source={require("../assets/location.png")}
                    style={styles.locationIcon}
                  />
                  <Text style={styles.locationText}>
                    {this.state.events[this.state.zoom].location}
                  </Text>
                </View>
                <Text style={styles.title}>
                  {this.state.events[this.state.zoom].title}
                </Text>
                <Text style={styles.hours}>
                  {this.state.events[this.state.zoom].hours}
                </Text>

                <Text style={styles.about}>À propos</Text>
                <Text style={styles.description}>
                  {this.state.events[this.state.zoom].description}
                </Text>

                <Text style={styles.about}>Autre</Text>
                <MapView
                  initialRegion={{
                    latitude: this.state.events[this.state.zoom].latitude,
                    longitude: this.state.events[this.state.zoom].longitude,
                    latitudeDelta: 0.0152,
                    longitudeDelta: 0.0151,
                  }}
                  style={styles.map}
                >
                  <Marker
                    coordinate={{
                      latitude: this.state.events[this.state.zoom].latitude,
                      longitude: this.state.events[this.state.zoom].longitude,
                    }}
                    title={this.state.events[this.state.zoom].title}
                  />
                </MapView>
              </View>
              <View style={{ paddingBottom: 100 }}></View>
            </View>
          </ScrollView>
        );
      }
    }
  }

  componentDidMount() {
    this._getPlanning().then(() => {
      this.setState({ isLoading: false });
    });
  }

  _renderFlatList() {
    if (!this.state.isLoading) {
      return (
        <FlatList
          ListHeaderComponent={
            <SafeAreaView>
              <View style={styles.header}>
                <Text style={styles.appName}>Journées</Text>
                <TouchableOpacity style={styles.notVisibleTouchable}>
                  <Image
                    source={require("../assets/search.png")}
                    style={styles.search}
                  />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          }
          showsVerticalScrollIndicator={false}
          data={this.state.events}
          scroll="vertical"
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.event}
              onPress={() => this.setState({ zoom: index })}
            >
              <ImageBackground style={{ flex: 1 }} source={{ uri: item.img }}>
                <LinearGradient
                  colors={["rgba(18,18,18,0)", "rgba(18,18,18,0.76)"]}
                  style={styles.overlay}
                >
                  <View style={styles.top}>
                    <View style={styles.dateBtn}>
                      <Text style={styles.day}>{item.day}</Text>
                      <Text style={styles.month}>{item.month}</Text>
                    </View>
                  </View>
                  <View style={styles.bottom}>
                    <View style={styles.location}>
                      <Image
                        source={require("../assets/location.png")}
                        style={styles.locationIcon}
                      />
                      <Text style={styles.locationText}>{item.location}</Text>
                    </View>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.hours}>{item.hours}</Text>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.img}
        />
      );
    }else{
      return(
        <SafeAreaView>
              <View style={styles.header}>
                <Text style={styles.appName}>Journées</Text>
                <TouchableOpacity style={styles.notVisibleTouchable}>
                  <Image
                    source={require("../assets/search.png")}
                    style={styles.search}
                  />
                </TouchableOpacity>
              </View>
              <View style={{height:'87%', width:'100%', justifyContent:'center'}}>
                <ActivityIndicator size="large" color="#EB62BC"/>
              </View>
        </SafeAreaView>
      )
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="light-content" />
        <View showsVerticalScrollIndicator={false}>
          <View style={styles.main}>
            {this._renderFlatList()}
            {this._displayInfos()}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  //Global
  screen: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loader: {
    width: wp("30%"),
    height: wp("20%"),
    position: "absolute",
    top: hp("50%") - wp("10%"),
    left: wp("50%") - wp("15%"),
  },

  //Header
  header: {
    marginTop: hp("2%"),
    marginBottom: hp("2%"),
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notVisibleTouchable: {
    width: 33,
    height: 33,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
  },
  appName: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  search: {
    width: 15,
    height: 15,
  },
  //Events
  main: {},
  event: {
    width: wp("100%") - 40,
    marginHorizontal: 20,
    height: wp("105%") - 40,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: hp("4%"),
  },
  overlay: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  top: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 20,
  },
  dateBtn: {
    backgroundColor: "white",
    width: 60,
    height: 66,
    borderRadius: 12,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  day: {
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: 0.5,
    color: "#121212",
  },
  month: {
    fontWeight: "400",
    fontSize: 11,
    textTransform: "uppercase",
    color: "#121212",
    opacity: 0.47,
    letterSpacing: 0.22,
  },
  bottom: {
    padding: 20,
  },
  location: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 5,
  },
  locationIcon: {
    width: 9,
    height: 12,
  },
  locationText: {
    color: "#00BBE1",
    fontSize: 13,
    letterSpacing: 0.22,
    lineHeight: 13,
    fontWeight: "600",
    marginLeft: 5,
  },
  title: {
    fontSize: 31,
    color: "#FFFFFF",
    letterSpacing: 0.62,
    lineHeight: 32,
    fontWeight: "bold",
    marginBottom: 5,
  },
  hours: {
    fontSize: 13,
    letterSpacing: 0.22,
    lineHeight: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    opacity: 0.91,
  },
  //Zoomed
  zoomed: {
    width: wp("100%"),
    height: hp("100%"),
    position: "absolute",
    zIndex: 10,
    top: 0,
    left: 0,
  },
  zoomedEvent: {
    width: wp("100%"),
    minHeight: hp("92%"),
    backgroundColor: "#1E1E1E",
    marginTop: hp("8%"),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  zoomedImg: {
    width: wp("100%"),
    height: wp("100%"),
    overflow: "hidden",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  zoomedBottom: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 20,
    height: "100%",
    width: "100%",
  },
  zoomedMain: {
    marginHorizontal: 20,
    marginTop: hp("4%"),
  },
  about: {
    fontSize: 19,
    letterSpacing: 0.36,
    lineHeight: 21,
    color: "#FFFFFF",
    marginTop: hp("4%"),
  },
  description: {
    fontSize: 13,
    letterSpacing: 0.24,
    lineHeight: 18,
    color: "#FFFFFF",
    opacity: 0.82,
    marginTop: hp("2%"),
  },
  leave: {
    width: 26,
    height: 26,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  cross: {
    width: 10,
    height: 10,
  },
  map: {
    width: wp("100%") - 40,
    height: wp("75%") - 40,
    marginTop: hp("2%"),
  },
});

export default Home;
