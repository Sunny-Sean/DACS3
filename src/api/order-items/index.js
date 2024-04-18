import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";

export function useInsertOrderItems() {
  return useMutation({
    async mutationFn(items) {
      const { error, data: newProduct } = await supabase
        .from("order_items")
        .insert(items)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },
  });
}
