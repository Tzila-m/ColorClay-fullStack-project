import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: {
        orders: [],
    }
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        addOrder: (state, action) => {
            const newOrder = action.payload;

            if (newOrder && newOrder._id) {
                const exists = state.user.orders.find(order => order._id === newOrder._id);
                if (!exists) {
                    state.user.orders.push(newOrder);
                }
            }
        },

        updateOrder: (state, action) => {
            const updatedOrder = action.payload;
            const index = state.user.orders.findIndex(order => order._id === updatedOrder._id);

            if (index !== -1) {
                state.user.orders[index] = updatedOrder;
            }
        },

        clearOrders: (state) => {
            state.user.orders = [];
        }
    },
});

export const { addOrder, updateOrder, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
