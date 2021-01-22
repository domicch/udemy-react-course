import React, {Component } from 'react';

import classes from './ContactData.module.css';
import Button from '../../../components/UI/Button/Button';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                modified: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                modified: false
            },
            postcode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Post Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 3,
                    maxLength: 6,
                },
                valid: false,
                modified: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                modified: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your email'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                modified: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'},
                    ]
                },
                value: 'fastest',
                validation: {
                    required: true
                },
                valid: true,
                modified: false
            }
        },
        isFormValid: false,
        loading: false
    }

    isValid(value, rules) {
        let isValid = true;

        if(!rules){
            return true;
        }

        if(rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }

        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }

        return isValid;
    }

    checkFormValid(form) {
        return Object.keys(form).map(fieldKey => {
            let field = form[fieldKey];

            if(!field.validation)
                return true;
            else
                return field.valid;
        }).reduce((accum, field) => {
            return accum && field;
        }, true);
    }

    orderHandler = (event) => {
        // prevent form default behavior of reloading the whole page
        event.preventDefault();

        // if(!this.checkFormValid()){
        //     console.log('ContactData.js form Invalid');
        //     return;
        // }else{
        //     console.log('ContactData.js form valid');
        // }

        const formData = {};

        for(let formElementId in this.state.orderForm){
            formData[formElementId] = this.state.orderForm[formElementId].value;
        }

        const order = {
            ingredients: this.props.ingredients,
            totalPrice: this.props.totalPrice,
            orderData: formData,
            time: new Date()
        }

        this.setState({loading: true});

        axios.post('/orders.json', order)
            .then(response => {
                this.setState({
                    loading: false,
                });
                this.props.history.push("/");
            })
            .catch(error => {
                this.setState({
                    loading: false,
                });
            })
        ;
    }

    inputChangedHandler = (event, inputId) => {
        //shallow clone only. Inner elements not cloned
        const updatedOrderForm = {
            ...this.state.orderForm
        }

        //clone the inner element which is to be updated
        const updatedFormElement = {
            ...updatedOrderForm[inputId]
        }
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.isValid(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.modified = true;
        updatedOrderForm[inputId] = updatedFormElement;
        

        this.setState({
            orderForm: updatedOrderForm,
            isFormValid: this.checkFormValid(updatedOrderForm)
        });
    }

    render () {
        const formElementsArray = [];
        for (let key in this.state.orderForm){
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType} 
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(event) => {this.inputChangedHandler(event, formElement.id)}}
                        needValidation={formElement.config.validation && formElement.config.modified}
                        invalid={!formElement.config.valid}
                    />
                ))}
                <Button 
                    btnType="Success"
                    elementConfig={{
                        disabled: !this.state.isFormValid
                    }}
                >ORDER</Button>
            </form>
        );

        if(this.state.loading){
            form = <Spinner/>
        }

        return (
            <div className={classes.ContactData}>
                <h4> enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData;