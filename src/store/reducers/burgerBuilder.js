import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../utility/utility';

const initialState = {
    ingredientPrices: {
        salad: 0.5,
        cheese: 0.4,
        meat: 1.3,
        bacon: 0.7
    },
    ingredients: null,
    totalPrice: 4,
    error: false,
    building: false
}

const addIngredient = (state, action) => {

    return updateObject(state,
        {
            ingredients: updateObject(state.ingredients, {
                [action.ingredientName]: state.ingredients[action.ingredientName] + 1
            }),
            totalPrice: state.totalPrice + state.ingredientPrices[action.ingredientName],
            building: true
        }
    );
}

const removeIngredient = (state, action) => {
    return updateObject(state,
        {
            ingredients: updateObject(state.ingredients, {
                [action.ingredientName]: state.ingredients[action.ingredientName] - 1
            }),
            totalPrice: state.totalPrice - state.ingredientPrices[action.ingredientName],
            building: true
        }
    );
}

const calculateTotalPrice = (ingredients, ingredientPrices) => {
    const totalPrice = Object.keys(ingredients)
    .map(ingrad => 
        ingredients[ingrad] * ingredientPrices[ingrad])
    .reduce((total, ingradPrice) => total + ingradPrice, 0);
    return 4+totalPrice;
}

const setIngredients = (state, action) => {
    return updateObject(state,
    {
        ingredients: action.ingredients,
        error: false,
        totalPrice: calculateTotalPrice(action.ingredients, state.ingredientPrices),
        building: false
    });
}

const fetchIngredientsFailed = (state) => {
    return updateObject(state,
        {error: true}
    );
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT:
            return addIngredient(state, action);
        case actionTypes.REMOVE_INGREDIENT:
            return removeIngredient(state, action);
        case actionTypes.SET_INGREDIENTS:
            return setIngredients(state, action);
        case actionTypes.FETCH_INGREDIENTS_FAILED:
            return fetchIngredientsFailed(state, action);
        default:
            return state;
    }
};

export default reducer;