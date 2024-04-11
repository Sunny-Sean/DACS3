import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import products from "../../../../assets/data/products";
import defaultPizzaImage from "../../../components/ProductListItem";
import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import { useCart } from "../../../providers/CartProvider";

const SIZES = ["S", "M", "L", "XL"];
const PRICES = ["1.38", "3.15", "4.29", "5.57"];

function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addItem } = useCart();

  const product = products.find((p) => p.id.toString() === id);

  const [selectedSize, setSelectedSize] = useState("S");
  // const [selectedNumbber, setSelectedNumber] = useState(0);

  // useEffect(() => {
  //   const numberSize = SIZES.indexOf(selectedSize);
  //   setSelectedNumber(numberSize);
  // }, [selectedSize]);

  const addToCart = () => {
    if (!product) return;
    addItem(product, selectedSize);
    router.push("/cart");
  };

  if (!product) {
    return <Text>Product not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product?.name }} />
      <Image
        source={{ uri: product.image || defaultPizzaImage }}
        style={styles.image}
      />

      <Text>Select Size</Text>

      {/* <View style={styles.sizes}>
        {SIZES.map((size) => (
          <Pressable
            onPress={() => setSelectedSize(size)}
            // onPress={() => setSize(size)}
            style={[
              styles.size,
              {
                backgroundColor: selectedSize === size ? "gainsboro" : "white",
              },
            ]}
            key={size}
          >
            <Text
              style={[
                styles.sizeText,
                {
                  color: selectedSize === size ? "black" : "gray",
                },
              ]}
            >
              {size}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.price}>${PRICES[selectedNumbber]}</Text>
      <Button onPress={() => addToCart()} text="Add to cart" />
    </View> */}
      <View style={styles.sizes}>
        {SIZES.map((size) => (
          <Pressable
            onPress={() => setSelectedSize(size)}
            key={size}
            style={[
              styles.size,
              {
                backgroundColor: size === selectedSize ? "gainsboro" : "white",
              },
            ]}
          >
            <Text
              style={[
                styles.sizeText,
                { color: size === selectedSize ? "black" : "gray" },
              ]}
            >
              {size}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.price}>Price: ${product.price.toFixed(2)}</Text>
      <Button onPress={addToCart} text="Add to cart" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: "auto",
    marginLeft: 6,
  },
  sizes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  size: {
    backgroundColor: "gainsboro",
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeText: {
    fontSize: 20,
    fontWeight: "500",
  },
});

export default ProductDetailsScreen;
