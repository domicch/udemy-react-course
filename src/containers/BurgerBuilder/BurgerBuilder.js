import React, {Component} from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/ErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index.js';


class BurgerBuilder extends Component {

    state = {
        showConfirm: false
    }

    componentDidMount() {
        this.props.onInitIngredients();
    }

    getOrderStatus = (ingredients) => {
        const sum = Object.keys(ingredients).reduce( (accum, ingrad) => {
            return accum + ingredients[ingrad];
        }, 0);

        return sum>0;
    }

    confirmOrderHandler = () => {
        if(this.props.isAuthenticated){
            this.setState({
                showConfirm: true
            });
        }else{
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push("/auth");
        }
        
    }

    cancelOrderHandler = () => {
        this.setState({
            showConfirm: false
        })
    }

    proceedOrderHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push({
            pathname: '/checkout'
        });
    }

    render() {
        let orderSummary = null;
        let burger = null;

        if(this.props.error){
            burger = <p>Error loading ingredients</p>;
        }else if(!this.props.ings) {
            orderSummary = <Spinner />;
            burger = <Spinner />;
        }else{
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}></Burger>
                    <BuildControls 
                        ingredients={this.props.ings}
                        addIngredient={this.props.onIngredientAdded}
                        removeIngredient={this.props.onIngredientRemoved} 
                        totalPrice={this.props.price}
                        disableOrder={!this.getOrderStatus(this.props.ings)}
                        confirmOrderClicked={this.confirmOrderHandler}
                        isAuth={this.props.isAuthenticated}
                    />
                </Aux>
            );

            if(this.state.showConfirm){
                orderSummary = (
                    <OrderSummary 
                        ingredients={this.props.ings} 
                        totalPrice={this.props.price}
                        cancelOrder={this.cancelOrderHandler}
                        proceedOrder={this.proceedOrderHandler}
                    />
                );
            }
        }

        return (
            <Aux>
                <Modal 
                    show={this.state.showConfirm}
                    modalClosed={this.cancelOrderHandler}
                >
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        ingPrice: state.burgerBuilder.ingredientPrices,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingredientName) => dispatch(actions.addIngredient(ingredientName)),
        onIngredientRemoved: (ingredientName) => dispatch(actions.removeIngredient(ingredientName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseBurgerInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
// export default BurgerBuilder;