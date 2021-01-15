import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,
        canOrder: false,
        state: 'BUILDING' //BUILDING, CONFIRM
    }

    getOrderStatus = (ingredients) => {
        const sum = Object.keys(ingredients).reduce( (accum, ingrad) => {
            return accum + ingredients[ingrad];
        }, 0);

        return sum>0;
    }

    addIngredientHandler = (type) => {
        this.setState(oldState => {
            let count = oldState.ingredients[type] + 1;
            let newIngredients = {...oldState.ingredients};
            newIngredients[type] = count;
            
            return {
                ingredients: newIngredients, 
                totalPrice: oldState.totalPrice+INGREDIENT_PRICES[type],
                canOrder: this.getOrderStatus(newIngredients)
            };
        });
    }

    removeIngredientHandler = (type) => {
        this.setState(oldState => {
            let count = oldState.ingredients[type];
            if(count > 0){
                count--;
                let newIngredients = {...oldState.ingredients};
                newIngredients[type] = count;
                
                return {
                    ingredients: newIngredients, 
                    totalPrice: oldState.totalPrice-INGREDIENT_PRICES[type],
                    canOrder: this.getOrderStatus(newIngredients)
                };
            }
            return null;
        });
    }

    confirmOrderHandler = () => {
        this.setState({
            state: 'CONFIRM'
        });
    }

    cancelOrderHandler = () => {
        this.setState({
            state: 'BUILDING'
        })
    }

    proceedOrderHandler = () => {
        alert('Proceed order');
    }

    render() {
        return (
            <Aux>
                <Modal 
                    show={this.state.state === 'CONFIRM'}
                    modalClosed={this.cancelOrderHandler}
                >
                    <OrderSummary 
                        ingredients={this.state.ingredients} 
                        totalPrice={this.state.totalPrice}
                        cancelOrder={this.cancelOrderHandler}
                        proceedOrder={this.proceedOrderHandler}
                    />
                </Modal>
                <Burger ingredients={this.state.ingredients}></Burger>
                <BuildControls 
                    ingredients={this.state.ingredients}
                    addIngredient={this.addIngredientHandler}
                    removeIngredient={this.removeIngredientHandler} 
                    totalPrice={this.state.totalPrice}
                    disableOrder={!this.state.canOrder}
                    confirmOrderClicked={this.confirmOrderHandler}
                />
            </Aux>
        );
    }
}

export default BurgerBuilder;