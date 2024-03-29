import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {apiUrl} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ActionButton = ({nim_2010054}) => {
  const [icon_1] = useState(new Animated.Value(40));
  const [icon_2] = useState(new Animated.Value(40));
  const [pop, setPop] = useState(false);
  const navigation = useNavigation();
  const popIn = () => {
    setPop(true);
    Animated.timing(icon_1, {
      toValue: 90,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_2, {
      toValue: 90,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  const popOut = () => {
    setPop(false);
    Animated.timing(icon_1, {
      toValue: 40,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_2, {
      toValue: 40,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const actionDeleteData = async () => {
    Alert.alert(
      'Konfirmasi',
      'Anda akan menghapus data ini?',
      [
        {
          text: 'Tidak',
          style: 'cancel',
        },
        {
          text: 'Ya',
          onPress: async () => {
            try {
              let token = await AsyncStorage.getItem('userToken');
              // Lakukan penghapusan data dosen dengan permintaan DELETE ke API
              const response = await fetch(
                `${apiUrl}mahasiswa/${nim_2010054}`,
                {
                  method: 'DELETE',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              if (response.status === 200) {
                // Data dosen berhasil dihapus wkwkwkwwkwkwk,,kenapa? ga update langsung..,, ahrus crool dulu,,ntr,,make subscribe
                Alert.alert('', 'Data mahasiswa berhasil dihapus!', [
                  {
                    text: 'Ok',
                    onPress: () =>
                      navigation.navigate('DataMahasiswa', {newData: true}),
                  },
                ]);
              } else {
                // Gagal menghapus data
                console.log('Gagal menghapus data');
                // Handle kesalahan jika penghapusan gagal gua jago anjing gg jawa #vald,,taik dodo
              }
            } catch (error) {
              console.error('Terjadi kesalahan:', error);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const showFormEdit = () => {
    navigation.navigate('FormEditMahasiswa', {nim_2010054: nim_2010054});
  };
  return (
    <View
      style={{
        flex: 1,
      }}>
      <Animated.View
        style={[styles.circle, {bottom: icon_1, backgroundColor: '#B31312'}]}>
        <TouchableOpacity onPress={actionDeleteData}>
          <Icon name="trash" size={20} color="#FFFF" />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={[styles.circle, {right: icon_2, backgroundColor: '#FFB534'}]}>
        <TouchableOpacity onPress={showFormEdit}>
          <Icon name="edit" size={20} color="#FFFF" />
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity
        style={[
          styles.circle,
          {
            backgroundColor: '#49108B',
          },
        ]}
        onPress={() => {
          pop === false ? popIn() : popOut();
        }}>
        <Icon name={pop === false ? 'plus' : 'close'} size={20} color="#FFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default ActionButton;
const styles = StyleSheet.create({
  circle: {
    backgroundColor: 'blue',
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 40,
    right: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
});
