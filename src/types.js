export const Product = {
  id: null,
  image: null,
  name: "",
  price: null,
};

export const PizzaSize = "S" || "M" || "L" || "XL";

export const CartItem = {
  id: "",
  product: Product,
  product_id: null,
  size: PizzaSize,
  quantity: null,
};

export const OrderStatusList = ["New", "Cooking", "Delivering", "Delivered"];

export const OrderStatus = "New" || "Cooking" || "Delivering" || "Delivered";

export const Order = {
  id: null,
  created_at: "",
  total: null,
  user_id: "",
  status: null,
  order_items: [],
};

export const OrderItem = {
  id: null,
  product_id: null,
  products: Product,
  order_id: null,
  size: PizzaSize,
  quantity: null,
};

export const Profile = {
  id: "",
  group: "",
};
