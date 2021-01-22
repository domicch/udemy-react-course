import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/ErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        canOrder: false,
        state: 'INIT', //INIT, BUILDING, CONFIRM,
        loading: true
    }

    componentDidMount() {
        console.log('BurgerBuilder componentDidMount start');
        axios.get('/ingredients.json')
            .then(response => {
                this.setState({
                    loading: false,
                    ingredients: response.data,
                    totalPrice: 4+this.calculateTotalPrice(response.data),
                    state: 'BUILDING',
                    canOrder: this.getOrderStatus(response.data)
                });
            })
            .catch(error => {
                this.setState({
                    loading: false,
                    state: 'ERROR'
                });
            });
            console.log('BurgerBuilder componentDidMount end');
    }

    calculateTotalPrice = (ingredients) => {
        const totalPrice = Object.keys(ingredients)
        .map(ingrad => 
            ingredients[ingrad] * INGREDIENT_PRICES[ingrad])
        .reduce((total, ingradPrice) => total + ingradPrice, 0);
        console.log('totalPrice: '+totalPrice);
        return totalPrice;
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
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price: this.state.totalPrice,
        //     customer: {
        //         name: 'Dominic Chan',
        //         address: 'Test street 1',
        //         postCode: 'ABC 123',
        //         email: '123@123.com'
        //     },
        //     deliveryMethod: 'fastest'
        // }

        // this.setState({loading: true});

        // axios.post('/orders.json', order)
        //     .then(response => {
        //         this.setState({
        //             loading: false,
        //             state: 'BUILDING'
        //         });
        //         console.log('BurgerBuilder: post response');
        //     })
        //     .catch(error => {
        //         this.setState({
        //             loading: false,
        //             state: 'BUILDING'
        //         });
        //         console.log('BurgerBuilder: post error');
        //     })
        // ;

        const queryParams=[];
        for(let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price='+this.state.totalPrice);

        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    render() {
        let orderSummary = null;
        let burger = null;

        if(this.state.loading) {
            orderSummary = <Spinner />;
            burger = <Spinner />;
        }

        if(this.state.state === 'BUILDING' || this.state.state === 'CONFIRM'){
            orderSummary = (
                <OrderSummary 
                    ingredients={this.state.ingredients} 
                    totalPrice={this.state.totalPrice}
                    cancelOrder={this.cancelOrderHandler}
                    proceedOrder={this.proceedOrderHandler}
                />
            );
            burger = (
                <Aux>
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
        }else if(this.state.state === 'ERROR'){
            burger = <p>Error loading ingredients</p>;
        }

        return (
            <Aux>
                <Modal 
                    show={this.state.state === 'CONFIRM'}
                    modalClosed={this.cancelOrderHandler}
                >
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);
// export default BurgerBuilder;