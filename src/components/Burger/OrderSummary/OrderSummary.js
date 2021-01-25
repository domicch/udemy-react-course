import React from 'react'
import Aux from '../../../hoc/Aux';
import Button from '../../UI/Button/Button';

const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map(ingrad => (
            <li key={ingrad}>
                <span style={{textTransform: 'capitalize'}}>{ingrad}</span>: {props.ingredients[ingrad]}
            </li>
        ));
    
    return (
        <Aux>
            <h3>Your Order</h3>
            <p>Your burger has the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Price: {props.totalPrice.toFixed(2)}</strong></p>
            <Button btnType='Success' clicked={props.proceedOrder}>Confirm</Button>
            <Button btnType='Danger' clicked={props.cancelOrder}>Cancel</Button>
        </Aux>
    );
};

export default orderSummary