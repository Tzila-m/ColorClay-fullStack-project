import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [],
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload
        },
        addOrder: (state, action) => {
            let newOrder = [...state.orders]
            console.log("action", action);
            newOrder.push({ ...action.payload })

            state.orders = [...newOrder]
            console.log("New order added:", newOrder);
            console.log("Current orders:", state.orders);
        },

        updateOrder: (state, action) => {
            let updatedOrder = [...state.orders];
            const index = state.orders.findIndex(order => order._id === action.payload.orderId);

            if (index !== -1) {
                updatedOrder[index].colorIds.push(action.payload.colorIds);
                updatedOrder[index].productIds.push(action.payload.productIds);
                updatedOrder[index].status="2";

                state.orders = updatedOrder;
            }
        },

        completeOrder: (state, action) => {
            let updatedOrder = [...state.orders];
            const index = state.orders.findIndex(order => order._id === action.payload.orderId);

            if (index !== -1) {
                updatedOrder[index].totalPrice = action.payload.totalPrice;
                updatedOrder[index].status = "3";

                state.orders = updatedOrder;
            }
        },

        clearOrders: (state) => {
            state.user.orders = [];
        }
    },
});

export const { addOrder, updateOrder, clearOrders, setOrders, completeOrder } = orderSlice.actions;
export default orderSlice.reducer;
