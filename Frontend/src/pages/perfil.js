import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const Perfil = () => {
  const [selectedTab, setSelectedTab] = useState("Información");
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/100"
  );
  const [userName, setUserName] = useState("Nombre del Usuario");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthDate, setBirthDate] = useState(new Date());
  const [jsonUSER, setJsonUser] = useState(null);

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");

      if (userData) {
        const jsonUSER = JSON.parse(userData);
        setJsonUser(jsonUSER);
        console.log("Datos del usuario:", jsonUSER);
      } else {
        console.log("No se encontró el usuario en AsyncStorage");
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };
  const [userInfo, setUserInfo] = useState({
<<<<<<< HEAD
    edad: "",
    fechaNacimiento: "",
    ciudad: "",
    carnet: "",
    carrera: "",
    anioIngreso: "",
    correo: "",
    facultad: "",
    telefono: "",
    direccion: "",
    pais: "",
    identificacion: "",
    username: "",
=======
    birthday: "",
    email: "",
    phone: "",
    username: "",
    street: "",
    city: "",
    state: "",
    personalEmail: "",
    postalCode: ""
>>>>>>> 0f7110bcce6e302ad934a29487b646f8d1eb59f4
  });

  useEffect(() => {
    if (jsonUSER) {
<<<<<<< HEAD
      setUserInfo({
        edad: jsonUSER.edad || "",
        fechaNacimiento: jsonUSER.fechaNacimiento || "",
        ciudad: jsonUSER.ciudad || "",
        carnet: jsonUSER.carnet || "",
        carrera: jsonUSER.carrera || "",
        anioIngreso: jsonUSER.anioIngreso || "",
        email: jsonUSER.email || "",
        facultad: jsonUSER.facultad || "",
        telefono: jsonUSER.telefono || "",
        direccion: jsonUSER.direccion || "",
        pais: jsonUSER.pais || "",
        identificacion: jsonUSER.identificacion || "",
        username: jsonUSER.username,
=======
      console.log("jsonUSER:", jsonUSER); // Verifica los datos
  
      setUserInfo({
        birthday: jsonUSER.birthday || "",
        email: jsonUSER.email || "",
        phone: jsonUSER.phone || "", // Aquí usas jsonUSER.phone si la propiedad existe
        username: jsonUSER.username || "",
        street: jsonUSER.address?.street || "", // Accede a la propiedad dentro de address
        city: jsonUSER.address?.city || "", // Accede a la propiedad dentro de address
        state: jsonUSER.address?.state || "", // Accede a la propiedad dentro de address
        personalEmail: jsonUSER.personalEmail || "", 
        postalCode: jsonUSER.address?.postalCode || "" 
>>>>>>> 0f7110bcce6e302ad934a29487b646f8d1eb59f4
      });
    }
  }, [jsonUSER]);

  useEffect(() => {
    getUserData();
  }, []);
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    if (jsonUSER && jsonUSER.username) {
      setUserName(jsonUSER.username);
    }
  }, [jsonUSER]);
  const pickImage = async () => {
    if (!isEditing) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const renderInfoBox = (label, value, key) => (
    <View style={styles.infoBox} key={key}>
      <Text style={styles.infoLabel}>{label}</Text>
      {key === "fechaNacimiento" && showDatePicker && isEditing ? (
        <>
          <TextInput
            style={[styles.infoValue, styles.input]}
            value={birthDate.toLocaleDateString()}
            editable={false}
          />
          <DateTimePicker
            value={birthDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              const currentDate = selectedDate || birthDate;
              if (currentDate instanceof Date) {
                setBirthDate(currentDate);
                setUserInfo((prevState) => ({
                  ...prevState,
                  [key]: currentDate,
                }));
              }
            }}
          />
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => {
              if (isEditing) {
                setShowDatePicker(true);
              }
            }}
          >
            <Text style={styles.infoValue}>
              {value instanceof Date ? value.toLocaleDateString() : value}
            </Text>
          </TouchableOpacity>
          {isEditing && (
            <TextInput
              style={[styles.infoValue, styles.input]}
              value={value}
              editable={false}
            />
          )}
        </>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.editIcon} onPress={handleEditToggle}>
          <MaterialCommunityIcons
            name={isEditing ? "check" : "pencil"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={pickImage} disabled={!isEditing}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        </TouchableOpacity>

        {isEditing ? (
          <TextInput
            style={styles.userName}
            value={userName}
            onChangeText={setUserName}
          />
        ) : (
          <Text style={styles.userName}>{userName}</Text>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === "Información" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("Información")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Información" && styles.activeTabText,
            ]}
          >
            Información
          </Text>
        </TouchableOpacity>
<<<<<<< HEAD
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === "Historial de Préstamos" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("Historial de Préstamos")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "Historial de Préstamos" && styles.activeTabText,
            ]}
          >
            Historial de Préstamos
          </Text>
        </TouchableOpacity>
=======
>>>>>>> 0f7110bcce6e302ad934a29487b646f8d1eb59f4
      </View>

      <View style={styles.tabContent}>
        {selectedTab === "Información" ? (
          <View style={styles.infoContainer}>
<<<<<<< HEAD
            {renderInfoBox("Edad", userInfo.edad, "edad")}
            {renderInfoBox(
              "Fecha de Nacimiento",
              userInfo.fechaNacimiento,
              "fechaNacimiento"
            )}
            {renderInfoBox("Ciudad", userInfo.ciudad, "ciudad")}
            {renderInfoBox("Carnet", userInfo.carnet, "carnet")}
            {renderInfoBox("Carrera", userInfo.carrera, "carrera")}
            {renderInfoBox(
              "Año de Ingreso",
              userInfo.anioIngreso,
              "anioIngreso"
            )}
            {renderInfoBox("Correo Electrónico", userInfo.email, "email")}
            {renderInfoBox("Facultad", userInfo.facultad, "facultad")}
            {renderInfoBox("Teléfono", userInfo.telefono, "telefono")}
            {renderInfoBox("Dirección", userInfo.direccion, "direccion")}
            {renderInfoBox("País", userInfo.pais, "pais")}
            {renderInfoBox(
              "Identificación",
              userInfo.identificacion,
              "identificacion"
            )}
=======
            {renderInfoBox(
              "Fecha de Nacimiento",
              userInfo.birthday,
              "birthday"
            )}
            {renderInfoBox("Ciudad", userInfo.city, "city")}
            {renderInfoBox("Calle", userInfo.street, "street")}
            {renderInfoBox("Correo Electrónico", userInfo.email, "email")}
            {renderInfoBox("Teléfono", userInfo.phone, "phone")}
            {renderInfoBox("Codigo Postal", userInfo.postalCode, "postalCode")}
            {renderInfoBox("Estado", userInfo.state, "state")}
            {renderInfoBox("Correo Personal", userInfo.personalEmail, "presonalEmail")}
            {renderInfoBox("Usuario", userInfo.username, "username")}
>>>>>>> 0f7110bcce6e302ad934a29487b646f8d1eb59f4
          </View>
        ) : (
          <Text style={styles.contentText}>Historial de préstamos...</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#000",
    width: "100%",
    height: height * 0.4,
    alignItems: "center",
    paddingTop: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  editIcon: {
    position: "absolute",
    top: 70,
    right: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 10,
    marginTop: 30,
  },
  userName: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  tab: {
    padding: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    backgroundColor: "#000",
    borderRadius: 10,
  },
  tabText: {
    fontSize: 16,
    color: "#555",
  },
  activeTabText: {
    color: "#fff",
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 100,
  },
  infoBox: {
    width: "48%",
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: "#000",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
  },
  contentText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
});

export default Perfil;