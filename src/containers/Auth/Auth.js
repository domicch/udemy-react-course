import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index'
import {checkFormFieldValid} from '../../utility/utility';



class Auth extends Component {
    state = {
        controls: new Map([
            ['email', {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                modified: false
            }],
            ['password', {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                modified: false
            }]
        ]),
        isRegister: false
    }

    componentDidMount() {
        if(this.props.building && this.props.authRedirectPath !== '/'){
            this.props.onSetAuthRedirectPath();
        }
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = new Map(this.state.controls);
        
        updatedControls.set(controlName, {
            ...this.state.controls.get(controlName),
            value: event.target.value,
            valid: checkFormFieldValid(event.target.value, this.state.controls.get(controlName).validation),
            modified: true
        });
        
        // {
        //     ...this.state.controls,
        //     [controlName]: {
        //         ...this.state.controls[controlName],
        //         value: event.target.value,
        //         valid: checkFormFieldValid(event.target.value, this.state.controls[controlName].validation),
        //         modified: true
        //     }
        // };

        this.setState({controls: updatedControls});
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.get('email').value,
            this.state.controls.get('password').value,
            this.state.isRegister);
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isRegister: !prevState.isRegister};
        });
    }

    render () {

        const formElementsArray = [];
        // for (let key in this.state.controls){
        //     formElementsArray.push({
        //         id: key,
        //         config: this.state.controls[key]
        //     });
        // }

        for (let [key, value] of this.state.controls){
            formElementsArray.push({
                id: key,
                config: value
            });
        }

        let form = (
            <form onSubmit={this.submitHandler}>
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
                <Button btnType="Success">Submit</Button>
            </form>
        );

        if(this.props.loading){
            form = <Spinner />;
        }

        let errorMessage = null;

        if(this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
        }

        let authRedirect = null;
        if(this.props.isAuthenticated){
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                {form}
                <Button btnType="Danger" clicked={this.switchAuthModeHandler}>Switch to {this.state.isRegister?'Login':'Register'}</Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        building: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isRegister) => dispatch(actions.auth(email, password, isRegister)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);