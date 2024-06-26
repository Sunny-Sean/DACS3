import { Text, View, StyleSheet, TextInput, Image, Alert } from "react-native";
import { useEffect, useState } from "react";

import * as ImagePicker from "expo-image-picker";

import Button from "../../../components/Button";
import { defaultPizzaImage } from "../../../components/ProductListItem";

import Colors from "../../../constants/Colors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "../../../api/products";
import { supabase } from "../../../lib/supabase";
import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { decode } from "base64-arraybuffer";

function CreateProductScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState("");
  const [image, setImage] = useState(null);

  // Lấy id từ url, nếu tồn tại id thì update
  const { id: idString } = useLocalSearchParams();
  // console.log("idString: " + idString?.[0]);
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0]
  );
  // console.log("id: " + id);
  const isUpdating = !!id;

  // Them san pham moi
  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  const { data: updatingProduct } = useProduct(id);

  // console.log(updatingProduct);

  const router = useRouter();

  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

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

  async function onCreate() {
    // Xác thực đầu vào sai thì return
    if (!validateInput()) {
      return;
    }

    const imagePath = await uploadImage();

    // console.warn("Creating product: ", name);

    // Save trong database
    insertProduct(
      { name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  }

  async function onUpdate() {
    // Xác thực đầu vào sai thì return
    if (!validateInput()) {
      return;
    }

    const imagePath = await uploadImage();

    // console.warn("Updating product: ");

    // Save trong database
    updateProduct(
      { id, name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  }

  function onSubmit() {
    if (isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
  }

  function onDelete() {
    deleteProduct(id, {
      onSuccess: () => {
        resetFields();
        router.replace("/(admin)");
      },
    });
    // console.warn("Delete");
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
    // Không cần yêu cầu quyền để khởi chạy thư viện hình ảnh
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // upload hình ảnh lên Supabase Storage
  const uploadImage = async () => {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), { contentType });

    console.log(error);

    if (data) {
      return data.path;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? "Update Product" : "Create Product" }}
      />
      <Image
        source={{
          uri:
            image ||
            "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png",
        }}
        style={styles.image}
      />
      {/* <Image
        source={
          isUpdating
            ? {
                uri: image,
              }
            : {
                uri: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png",
              }
        }
        style={styles.image}
      /> */}
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
