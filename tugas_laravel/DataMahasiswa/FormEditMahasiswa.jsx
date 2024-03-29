import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  View,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {apiUrl} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormEdit({route}) {
  const {nim_2010054} = route.params;
  const [mahasiswa_2010054, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');

  const [namaLengkap, setNamaLengkap] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('L');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState(new Date());
  const [alamat_2010054, setAlamat] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const navigation = useNavigation();
  const [validationErrors, setValidationErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tanggalLahir;
    setDatePickerVisible(Platform.OS === 'ios');
    setTanggalLahir(currentDate);
  };

  const formatDate = date => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = await AsyncStorage.getItem('userToken');
        console.log(`${nim_2010054}`);
        const response = await fetch(`${apiUrl}mahasiswa/${nim_2010054}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json();
        setNamaLengkap(json.nama_lengkap_2010054);
        setJenisKelamin(json.jenis_kelamin_2010054);
        setTempatLahir(json.tmp_lahir_2010054);
        setTanggalLahir(new Date(json.tgl_lahir_2010054));
        setAlamat(json.alamat_2010054);
        setNoTelp(json.notelp_2010054);
      } catch (error) {
        setError('Tidak dapat memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nim_2010054]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }
  if (error) {
    return <Text>{error}</Text>;
  }

  const submitForm = async () => {
    setIsSaving(true);
    setValidationErrors({});

    const formData = {
      alamat_2010054,
      alamat_2010054,
      nama_lengkap_2010054: namaLengkap,
      jenis_kelamin_2010054: jenisKelamin,
      tmp_lahir_2010054: tempatLahir,
      tgl_lahir_2010054: tanggalLahir.toISOString().split('T')[0], // Format to YYYY-MM-DD
      notelp_2010054: noTelp,
      _method: 'PUT',
    };

    try {
      let token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${apiUrl}mahasiswa/${nim_2010054}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',

          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();

        // Handle validation errors
        if (response.status === 422) {
          let errors = {};
          Object.keys(data.errors).forEach(key => {
            errors[key] = data.errors[key][0]; // Ambil hanya pesan pertama untuk setiap field
          });
          setValidationErrors(errors);
        } else {
          setValidationErrors({});
          throw new Error(
            data.message || 'Terjadi kesalahan saat meng-update data.',
          );
        }
      }

      setIsSaving(false);

      // Jika tidak ada error, maka tampilkan pesan sukses
      Alert.alert('Success', 'Data mahasiswa ini berhasil di-Update', [
        {
          text: 'Ok',
          onPress: () =>
            navigation.navigate('DetailMahasiswa', {
              nim_2010054: nim_2010054,
            }),
        },
      ]);
    } catch (error) {
      // Handle failure
      setIsSaving(false);
      Alert.alert('Error', error.toString());
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <Input
        placeholder="NIM"
        value={nim_2010054}
        disabled={true}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        leftIcon={<Icon name="user-circle" size={24} color="black" />}
      />

      <Input
        placeholder="Nama Lengkap"
        value={namaLengkap}
        onChangeText={setNamaLengkap}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        leftIcon={<Icon name="user" size={24} color="black" />}
        errorMessage={validationErrors.nama_lengkap_2010054}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={jenisKelamin}
          onValueChange={(itemValue, itemIndex) => setJenisKelamin(itemValue)}
          style={styles.picker}>
          <Picker.Item label="Pilih Jenis Kelamin" value="" />
          <Picker.Item label="Laki-laki" value="L" />
          <Picker.Item label="Perempuan" value="P" />
        </Picker>
      </View>

      <Input
        placeholder="Tempat Lahir"
        value={tempatLahir}
        onChangeText={setTempatLahir}
        leftIcon={<Icon name="home" size={24} color="black" />}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        errorMessage={validationErrors.tmp_lahir_2010054}
      />

      <View style={styles.dateContainer}>
        <Button
          title="Pilih Tanggal Lahir"
          onPress={() => setDatePickerVisible(true)}
          icon={<Icon name="calendar" size={15} color="white" />}
        />
        {datePickerVisible && (
          <DateTimePicker
            value={tanggalLahir}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        <Text style={styles.dateDisplay}>
          Tanggal Lahir: {formatDate(tanggalLahir)}
        </Text>
      </View>

      <Input
        placeholder="Alamat"
        value={alamat_2010054}
        onChangeText={setAlamat}
        leftIcon={<Icon name="map-marker-alt" size={24} color="black" />}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        errorMessage={validationErrors.alamat_2010054}
      />

      <Input
        placeholder="Nomor Telpon"
        value={noTelp}
        onChangeText={setNoTelp}
        leftIcon={<Icon name="phone" size={24} color="black" />}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        errorMessage={validationErrors.notelp_2010054}
        keyboardType="number-pad"
      />

      <Button
        title="Update Data"
        onPress={submitForm}
        buttonStyle={styles.submitButton}
        titleStyle={styles.submitTitle}
        loading={isSaving}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 30,
  },
  container: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingLeft: 10,
  },
  inputText: {
    color: '#000',
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    marginHorizontal: 10,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#427D9D',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 10,
  },
  submitTitle: {
    color: '#fff', //warna text tombol
  },
  dateContainer: {
    marginBottom: 20,
    marginHorizontal: 10,
  },
  dateDisplay: {
    fontSize: 16,
    marginTop: 10,
  },
});
