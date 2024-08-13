// Interface representing each order
export interface OrderProduct {
  pid: string; // Product ID
  price: number; // Price of the item
  quantity: number; // Quantity of the item ordered
  category: string; // Category of the item (e.g., "momo", "cold drinks")
  name: string; // Name of the item
}

// Interface representing the data for each day
export interface DailyOrders {
  id: string; // Date in YYYY-MM-DD format
  orders: OrderProduct[]; // Array of orders for the given date
}

// Interface representing the entire chart data
export interface ChartData {
  chartData: DailyOrders[]; // Array of daily orders data
}
