import { Text, View, StyleSheet, TextInput, Image, Alert } from "react-native";
import { useState } from "react";

import * as ImagePicker from "expo-image-picker";

import Button from "../../../components/Button";
import { defaultPizzaImage } from "../../../components/ProductListItem";

import Colors from "../../../constants/Colors";
import { Stack, useLocalSearchParams } from "expo-router";

function CreateProductScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState("");
  const [image, setImage] = useState(null);

  // Lấy id từ url, nếu tồn tại id thì update
  const { id } = useLocalSearchParams();
  const isUpdating = !!id;

  function resetFields() {
    setName("");
    setPrice("");
  }

  // Xác thực đầu vào
  function validateInput() {
    setErrors("");
    if (!name) {
      setErrors("Name is required");
      return false;
    }
    if (!price) {
      setErrors("Price is required");
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setErrors("Price is not a number");
      return false;
    }
    return true;
  }

  function onCreate() {
    // Xác thực đầu vào sai thì return
    if (!validateInput()) {
      return;
    }

    console.warn("Creating product: ", name);

    // Save trong database

    resetFields();
  }

  function onUpdate() {
    // Xác thực đầu vào sai thì return
    if (!validateInput()) {
      return;
    }

    console.warn("Updating product: ");

    // Save trong database

    resetFields();
  }

  function onSubmit() {
    if (isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
  }

  function onDelete() {
    console.warn("Delete");
  }

  function confirmDelete() {
    Alert.alert("Confirm", "Are you sure you want to delete this product", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? "Update Product" : "Create Product" }}
      />
      <Image
        source={{ uri: image || defaultPizzaImage }}
        style={styles.image}
      />
      <Text onPress={pickImage} style={styles.textButton}>
        Select Image
      </Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />

      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="9.99"
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={{ color: "red" }}>{errors}</Text>
      <Button onPress={onSubmit} text={isUpdating ? "Update" : "Create"} />
      {isUpdating && (
        <Text onPress={confirmDelete} style={styles.textButton}>
          Delete
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  image: {
    width: "50%",
    aspectRatio: 1,
    alignSelf: "center",
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
  label: {
    color: "gray",
    fontSize: 16,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
});

export default CreateProductScreen;
