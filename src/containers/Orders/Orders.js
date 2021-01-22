import React, {Component} from 'react';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/ErrorHandler/withErrorHandler';

class Orders extends Component {

    state = {
        orders: [],
        loading: true
    }

    componentDidMount() {
        axios.get('/orders.json')
        .then(res => {

            let orders = Object.keys(res.data).map(id => {
                return { 
                    ...res.data[id],
                    id: id
                }
            });
            console.log('Orders.js',orders);

            this.setState({
                loading: false,
                orders: orders
            });
        })
        .catch(err => {
            this.setState({
                loading: false
            });
        })
        ;
    }

    render() {
        return (
            <div>
                {this.state.orders.map(order => (
                    <Order 
                        key={order.id}
                        ingredients={order.ingredients}
                        totalPrice={parseFloat(order.totalPrice)}
                    />
                ))}
            </div>
        );
    }
}

export default withErrorHandler(Orders, axios);