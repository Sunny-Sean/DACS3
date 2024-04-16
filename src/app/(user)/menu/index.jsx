import { FlatList, View } from "react-native";
import ProductListItem from "../../../components/ProductListItem";
import products from "../../../../assets/data/products";
import { useEffect } from "react";
import { supabase } from "../../../lib/supabase";

export default function MenuScreen() {
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from("products").select("*");
      // console.log(error);
      console.log(data);
    }
    fetchProducts();
  }, []);
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductListItem product={item} />}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
    />
  );
}
