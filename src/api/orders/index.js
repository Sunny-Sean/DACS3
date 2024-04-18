import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";

// Lấy được mọi đơn order
export function useAdminOrderList({ archived = false }) {
  const statuses = archived ? ["Delivered"] : ["New", "Cooking", "Delivering"];

  return useQuery({
    queryKey: ["orders", { archived }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", statuses)
        .order("created_at", { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}

// Lấy được đơn oder chỉ theo id của mình
export function useMyOrderList() {
  const { session } = useAuth();
  // console.log(session);
  const id = session?.user.id;

  return useQuery({
    queryKey: ["orders", { userId: id }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}

// Doc san pham theo id
export function useOrderDetails(id) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}

export function useInsertOrder() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(data) {
      const { error, data: newProduct } = await supabase
        .from("orders")
        .insert({
          ...data,
          user_id: userId,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },

    // Xoa cache cua products va lam moi lai danh sach
    async onSuccess() {
      await queryClient.invalidateQueries(["orders"]);
    },
  });
}

// Cập nhật trạng thái đơn hàng
export function useUpdateOrder() {
  // queryClientL: tương tác và thực hiện truy vấn
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({ id, updatedFields }) {
      const { error, data: updatedProduct } = await supabase
        .from("orders")
        .update(updatedFields)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return updatedProduct;
    },

    // Sau khi them thanh cong thi tai lai du lieu
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries(["orders"]);
      await queryClient.invalidateQueries(["orders", id]);
    },
  });
}
