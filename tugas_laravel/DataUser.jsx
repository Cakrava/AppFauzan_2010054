import {
  View,
  Button,
  StyleSheet,
  Alert,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {apiUrl} from './config';
import Icon from 'react-native-vector-icons/Ionicons';
import {apiImage} from './API';

export default function DataUser({setUserToken}) {
  const navigation = useNavigation();
  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Apakah anda yakin ingin logout?',
      [
        {
          text: 'Batal',
          onPress: () => console.log('Logout dibatalkan'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => handleLogout()},
      ],
      {cancelable: false},
    );
  };

  const handleLogout = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      let response = await fetch(`${apiImage}/api/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await AsyncStorage.removeItem('userToken');
        setUserToken(null);
        navigation.navigate('Login');
      } else {
        console.log('Logout failed');
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="menu" size={30} color="#000" />
        <Icon name="notifications-outline" size={30} color="#000" />
      </View>
      <Image source={require('./img/avatar11.png')} style={styles.avatar} />
      <Text style={styles.name}>Anne Pearbaum</Text>
      <Text style={styles.jobTitle}>SINGER</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>285</Text>
          <Icon name="heart-outline" size={20} color="#000" />
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>1275</Text>
          <Icon name="people-outline" size={20} color="#000" />
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>470</Text>
          <Icon name="chatbubble-outline" size={20} color="#000" />
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>320</Text>
          <Icon name="share-social-outline" size={20} color="#000" />
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  jobTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  logoutButton: {
    marginTop: 32,
    backgroundColor: '#f44',
    padding: 12,
    borderRadius: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
