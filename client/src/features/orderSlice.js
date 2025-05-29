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
            const index = state.orders.findIndex(order => order._id === action.payload.validOrder._id);

            if (index !== -1) {
                updatedOrder[index].colorIds.push(action.payload.colorIds);
                updatedOrder[index].productIds.push(action.payload.productIds);
                state.orders = updatedOrder;
            }
        },

        clearOrders: (state) => {
            state.user.orders = [];
        }
    },
});

export const { addOrder, updateOrder, clearOrders, setOrders } = orderSlice.actions;
export default orderSlice.reducer;
