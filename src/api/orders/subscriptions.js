import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { useEffect } from "react";

export function useInsertOrderSubscription() {
  const queryClient = useQueryClient();

  //  lắng nghe các sự kiện thời gian thực này và cập nhật giao diện người dùng
  useEffect(() => {
    const ordersSubscription = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          console.log("Change received!", payload);
          queryClient.invalidateQueries(["orders"]);
        }
      )
      .subscribe();

    return () => {
      ordersSubscription.unsubscribe();
    };
  }, []);
}

// theo dõi sự thay đổi trong đơn hàng cụ thể và cập nhật giao diện
export function useUpdateOrderSubscription(id) {
  const queryClient = useQueryClient();
  useEffect(() => {
    const orders = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          queryClient.invalidateQueries(["orders", id]);
        }
      )
      .subscribe();

    return () => {
      orders.unsubscribe();
    };
  }, []);
}
