import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Card, Avatar} from 'react-native-elements';
import {apiUrl, apiImage} from '../config';
import defaultAvatar from '../img/avatar15.png';
import ActionButton from './ActionButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const DetailMahasiswa = ({route}) => {
  const {nim_2010054} = route.params;
  const [mahasiswa_2010054, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const goToPageFormUpload = () => {
    navigation.navigate('FormUpload', {
      nim_2010054: nim_2010054,
      foto: mahasiswa_2010054.foto_thumb,
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const fetchData = async () => {
        try {
          let token = await AsyncStorage.getItem('userToken');
          const response = await fetch(`${apiUrl}mahasiswa/${nim_2010054}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const json = await response.json();
          setMahasiswa(json);
        } catch (error) {
          setError('Tidak dapat memuat data');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    });
    return unsubscribe;
  }, [navigation, nim_2010054]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }
  if (error) {
    return <Text>{error}</Text>;
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        {mahasiswa_2010054 && (
          <Card>
            <Avatar
              size="xlarge"
              rounded
              source={
                mahasiswa_2010054.foto
                  ? {uri: `${apiImage}${mahasiswa_2010054.foto_thumb}`}
                  : defaultAvatar
              }
              containerStyle={styles.avatarContainer}
              onPress={goToPageFormUpload}
            />
            <Card.Title style={styles.title}>
              {mahasiswa_2010054.nim_2010054}
            </Card.Title>
            <Card.Divider />
            <Text style={styles.detail}>Nama:</Text>
            <Text style={styles.detailData}>
              {mahasiswa_2010054.nama_lengkap_2010054}
            </Text>
            <Text style={styles.detail}>Jenkel:</Text>
            <Text style={styles.detailData}>
              {mahasiswa_2010054.jenis_kelamin_2010054 == 'L'
                ? 'Laki-Laki'
                : 'Perempuan'}
            </Text>
            <Text style={styles.detail}>Tanggal/Tgl.Lahir:</Text>
            <Text style={styles.detailData}>
              {mahasiswa_2010054.tmp_lahir_2010054} /{' '}
              {mahasiswa_2010054.tgl_lahir_2010054}
            </Text>
            <Text style={styles.detail}>Alamat:</Text>
            <Text style={styles.detailData}>
              {mahasiswa_2010054.alamat_2010054}
            </Text>
            <Text style={styles.detail}>Telp/Hp:</Text>
            <Text style={styles.detailData}>
              {mahasiswa_2010054.notelp_2010054}
            </Text>
          </Card>
        )}
        <ActionButton nim_2010054={mahasiswa_2010054.nim_2010054} />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detail: {
    fontSize: 14,
    marginBottom: 5,
    color: '#ccd',
    fontWeight: 'bold',
    marginTop: 10,
  },
  detailData: {
    fontSize: 18,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: 'black',
    fontWeight: 'bold',
  },
});
export default DetailMahasiswa;
