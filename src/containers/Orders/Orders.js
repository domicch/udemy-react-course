import React, {Component} from 'react';
import {connect} from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/ErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import Burger from '../../components/Burger/Burger';
import Aux from '../../hoc/Aux';


class Orders extends Component {

    state = {
        showOrderDetail: false,
        ingredients: null
    }

    componentDidMount() {
        this.props.onFetchOrders(this.props.token, this.props.userId);
    }

    hideOrderDetail = () => {
        this.setState({
            showOrderDetail: false,
            ingredients: null
        });
    }

    showOrderDetail = (ingredients) => {
        this.setState({
            showOrderDetail: true,
            ingredients: ingredients
        });
    }

    render() {
        let orders = <Spinner />

        if(!this.props.loading){
            orders = this.props.orders.map(order => (
                <Order 
                    key={order.id}
                    ingredients={order.ingredients}
                    totalPrice={parseFloat(order.totalPrice)}
                    clicked={() => {this.showOrderDetail(order.ingredients)}}
                />
            ));
        }

        let modal = null;

        if(this.state.showOrderDetail){
            modal = (
                <Modal 
                    show={this.state.showOrderDetail}
                    modalClosed={this.hideOrderDetail}
                >
                    <h1>This is your ordered burger</h1>
                    <div style={{width: '100%', margin: 'auto' }}>
                        <Burger ingredients={this.state.ingredients}/>
                    </div>
                </Modal>
            );
        }

        return (
            <Aux>
                {modal}
                {orders}
            </Aux>
            
        );
    }
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));