import 'expo-dev-client';

import React, { useEffect, useState } from 'react';

import { StyleSheet, View } from 'react-native';

import Mapbox from '@rnmapbox/maps';

import * as Location from 'expo-location';

import axios from 'axios';

import Search from './components/Search';


Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '');

const App = () => {
  const [location, setLocation] = useState(null);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.error('Permission to access location was denied');

        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});

      setLocation(currentLocation.coords);
    })();
  }, []);

  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${process.env.EXPO_PUBLIC_MAPBOX_TOKEN}`
      );

      setSuggestions(response.data.features);
    } catch (error) {
      console.error('Error searching for location:', error);
    }
  };

  const handleSuggestionPress = (suggestion) => {
    const [longitude, latitude] = suggestion.center;
    setSearchedLocation({ longitude, latitude });
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <Search
        onSearch={handleSearch}
        suggestions={suggestions}
        onSuggestionPress={handleSuggestionPress}
      />

      {location && (
        <Mapbox.MapView style={styles.map} styleURL={Mapbox.StyleURL.Street}>
          <Mapbox.Camera
            zoomLevel={15}
            centerCoordinate={
              searchedLocation
                ? [searchedLocation.longitude, searchedLocation.latitude]
                : [location.longitude, location.latitude]
            }
            animationMode="flyTo"
            animationDuration={2000}
          />

          <Mapbox.PointAnnotation
            id="userLocation"
            coordinate={[location.longitude, location.latitude]}
            title="Your location"
          />

          {searchedLocation && (
            <Mapbox.PointAnnotation
              id="searchedLocation"
              coordinate={[
                searchedLocation.longitude,
                searchedLocation.latitude,
              ]}
              title="Searched location"
            />
          )}
        </Mapbox.MapView>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#fff',
  },

  map: {
    flex: 1,
  },
});