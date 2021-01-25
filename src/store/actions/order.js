import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerInit = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_INIT
    };
}

export const purchaseBurderSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    };
};

export const purchaseBurgerFailed = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAILED,
        error: error
    };
};

export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    };
}

export const purchaseBurger = (orderData, token) => {
    return dispatch => {
        dispatch(purchaseBurgerStart());
        axios.post('/orders.json?auth='+token, orderData)
            .then(response => {
                dispatch(purchaseBurderSuccess(response.data.name, orderData));
            })
            .catch(error => {
                dispatch(purchaseBurgerFailed());
            })
        ;
    }
}

export const fetchOrdersSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders: orders
    };
};

export const fetchOrdersFailed = (error) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAILED,
        error: error
    };
};

export const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    };
}

export const fetchOrders = (token, userId) => {
    return dispatch => {
        dispatch(fetchOrdersStart());

        // good example to preprocess data before passing to reducer
        const queryParams = [
            'auth='+token,
            'orderBy="userId"&equalTo="'+userId+'"'
        ].join('&');

        axios.get('/orders.json?' + queryParams)
        .then(res => {

            let orders = Object.keys(res.data).map(id => {
                return { 
                    ...res.data[id],
                    id: id
                }
            });
            dispatch(fetchOrdersSuccess(orders));
        })
        .catch(err => {
            dispatch(fetchOrdersFailed());
        });
    }
}