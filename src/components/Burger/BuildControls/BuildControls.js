import React from 'react';
import classes from './BuildControls.module.css'
import BuildControl from './BuildControl/BuildControl';
import StringUtil from '../../../utility/stringUtil';

const buildControls = (props) => (
    <div className={classes.BuildControls}>
        <p>Total price: {props.totalPrice.toFixed(2)}</p>
        {
        Object.keys(props.ingredients).map(ingrad => (
            <BuildControl
                key={ingrad}
                label={StringUtil.captalise(ingrad)}
                added={() => {props.addIngredient(ingrad);}}
                removed={() => {props.removeIngredient(ingrad);}}
                disabled={props.ingredients[ingrad]<=0}
            />
        ))
        }
        <button 
            className={classes.OrderButton}
            disabled={props.disableOrder}
            onClick={props.confirmOrderClicked}
        >Order now!</button>
    </div>
);

export default buildControls;