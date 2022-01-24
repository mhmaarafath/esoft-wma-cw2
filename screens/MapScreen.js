import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, {useState, useEffect} from 'react';
import MapView, { Callout, Circle, Heatmap, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axiosConfig from '../helpers/axiosConfig';
import { ActivityIndicator, Button } from 'react-native-paper';

export default function MapScreen({navigation}) {
  const [region, setRegion] = useState();
  const [locations, setLocations] = useState();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    getCurrentLocation();
    getAllTweets()
  }, []);

  async function getCurrentLocation(){
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  }


  function getAllTweets(){
    axiosConfig.get(`/tweets_all`)
    .then((response) => {
        setLocations(response.data.data);
        console.log(locations[0])
        setIsLoading(false);
    })
    .catch(error => {
        console.log(error)
        setIsLoading(false);
    })
}



function goToTweetScreen(tweetId){
  navigation.navigate('Tweet Screen', {
      tweetId : tweetId
  });
}




  return (
    <View style={styles.container}>
      {
      (!isLoading && region && locations) ? (
        <>        
      <MapView 
          initialRegion={region} style={styles.map}
          showsMyLocationButton={true}    
          style={styles.map}
      >
          <Marker 
              pinColor='gold'
              coordinate={{latitude: region.latitude, longitude: region.longitude}}
          >
              <Callout>
                  <Text>Current Location</Text>
              </Callout>
          </Marker>


        {locations.map((element, key) => {
         return (
          <Marker 
          key={key}
          pinColor='red'
          coordinate={{latitude: element.latitude, longitude: element.longitude}}
          >
            <Callout onPress={()=> goToTweetScreen(element.id)}>
                <Text>{element.user.name}</Text>
            </Callout>
          </Marker>
          );
        })}

      </MapView>
      <Button mode='contained' style={{position: 'absolute', right: 30, top: 30, zIndex: 1000}} onPress={getCurrentLocation}>Refresh</Button>
      </>
      ) : (
        <ActivityIndicator style={{marginTop: 8}} size="large" color="gray" />
      )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
