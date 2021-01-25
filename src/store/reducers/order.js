import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../utility/utility';

const initialState = {
    orders: [],
    loading: false,
    purchased: false
};

const purchaseBurgerSuccecss = (state, action) => {
    const newOrder = {
        ...action.orderData,
        id: action.orderId
    }
    return updateObject(state, 
    {
        loading: false,
        orders: state.orders.concat(newOrder),
        purchased: true
    });
}

const purchaseBurgerFailed = (state) => {
    return updateObject(state, {loading: false});
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.PURCHASE_BURGER_INIT:
            return {
                ...state,
                purchased: false
            }
        case actionTypes.PURCHASE_BURGER_START:
            return {
                ...state,
                loading: true
            }
        case actionTypes.PURCHASE_BURGER_SUCCESS:
            return purchaseBurgerSuccecss(state, action);
        case actionTypes.PURCHASE_BURGER_FAILED:
            return purchaseBurgerFailed(state);
        case actionTypes.FETCH_ORDERS_START:
            return {
                ...state,
                loading: true
            }
        case actionTypes.FETCH_ORDERS_SUCCESS:
            return {
                ...state,
                orders: action.orders,
                loading: false
            }
        case actionTypes.FETCH_ORDERS_FAILED:
            return {
                ...state,
                loading: false
            }
        default:
            return state;
    }
}

export default reducer;