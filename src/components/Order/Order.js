import React from 'react';
import classes from './Order.module.css';

const order = (props) => {
    
    const ingredientsOutput = Object.keys(props.ingredients).map( ingrad => {
        return (
            <span 
                style={{
                    textTransform: 'capitalize',
                    margin: '0 8px',
                    border: '1px solid #ccc',
                    padding: '5px'
                }}
                key={ingrad}>
                {ingrad} ({props.ingredients[ingrad]})
            </span>
        );
    });

    return (
        <div className={classes.Order}>
            <p>Ingredients: {ingredientsOutput}</p>
            <p>Price: <strong>{props.totalPrice.toFixed(2)}</strong></p>
        </div>
    );
}

export default order;