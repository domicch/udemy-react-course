import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
    // state = {
    //     ingredients: {},
    //     totalPrice: 0
    // }

    // componentDidMount() {
    constructor(props) {
        super(props);
        console.log('Checkout.js constructor', props);
        const query = new URLSearchParams(props.location.search);
        const ingredients = {};
        let price = 0;

        for (let params of query.entries()) {
            if(params[0] === 'price'){
                price = params[1];
            }else{
                ingredients[params[0]] = parseInt(params[1]);
            }
        }

        // this.setState({
        this.state = {
            ingredients: ingredients,
            totalPrice: price
        };
    }

    cancelOrderHandler = () => {
        this.props.history.goBack();
    }

    proceedOrderHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render () {
        return (
            <div>
                <CheckoutSummary 
                    ingredients={this.state.ingredients}
                    cancelOrder={this.cancelOrderHandler}
                    proceedOrder={this.proceedOrderHandler}
                />
                <Route path={this.props.match.path + '/contact-data'} 
                    render={
                        (props) => {
                            console.log('Checkout.js ', props);

                            return (<ContactData 
                                ingredients={this.state.ingredients} 
                                totalPrice={this.state.totalPrice} 
                                // this props is to pass on Router props to component for history.push inside
                                {...props}
                            />)
                        }
                    }
                />
            </div>
        );
    }
}

export default Checkout;