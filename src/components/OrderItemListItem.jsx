import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import { OrderItem } from "../types";
import { defaultPizzaImage } from "./ProductListItem";
import { Link, useSegments } from "expo-router";

function OrderItemListItem({ item }) {
  const segment = useSegments();
  // console.log(segment);
  // console.log(item.products.id);

  return (
    <Link href={`/${segment[0]}/menu/${item.products.id}`} asChild>
      <Pressable style={styles.container}>
        <Image
          // source={{ uri: item.products.image || defaultPizzaImage }}
          source={{
            uri:
              item.products.image ||
              "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png",
          }}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.products.name}</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.price}>${item.products.price.toFixed(2)}</Text>
            <Text>Size: {item.size}</Text>
          </View>
        </View>
        <View style={styles.quantitySelector}>
          <Text style={styles.quantity}>{item.quantity}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 75,
    aspectRatio: 1,
    alignSelf: "center",
    marginRight: 10,
  },
  title: {
    fontWeight: "500",
    fontSize: 16,
    marginBottom: 5,
  },
  subtitleContainer: {
    flexDirection: "row",
    gap: 5,
  },
  quantitySelector: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  quantity: {
    fontWeight: "500",
    fontSize: 18,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: "bold",
  },
});

export default OrderItemListItem;
