import React from 'react';

import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import classes from './CheckoutSummary.module.css';

const checkoutSummary = (props) => {
    return (
        <div className={classes.CheckoutSummary}>
            <h1>We hope you enjoy the burger</h1>
            <div style={{width: '100%', margin: 'auto' }}>
                <Burger ingredients={props.ingredients}/>
            </div>
            <Button 
                btnType="Success"
                clicked={props.proceedOrder}
            >CONTINUE</Button>
            <Button 
                btnType="Danger"
                clicked={props.cancelOrder}
            >CANCEL</Button>
            
        </div>
    );
}

export default checkoutSummary;