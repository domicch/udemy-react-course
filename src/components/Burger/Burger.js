import React from 'react';
import classes from './Burger.module.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {

    let transformedIngredients = Object.keys(props.ingredients)
    .sort()
    .map(igKey => {
        return [...Array(props.ingredients[igKey])]
        .map((_,i) => <BurgerIngredient key={igKey+i} type={igKey} />)
    })
    .reduce((arr, el) => {
        return arr.concat(el);
    },[]);

    if(transformedIngredients.length === 0){
        transformedIngredients = <p>Please add ingredients</p>
    }

    // const transformedIngredients = [];

    // for(const ig in props.ingredients){
    //     let count = props.ingredients[ig];
    //     for(let i=0;i<count;i++){
    //         transformedIngredients.push(<BurgerIngredient key={ig+i} type={ig} />);
    //     }
    // }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
};

export default burger;