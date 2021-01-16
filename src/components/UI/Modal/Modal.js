import React, {Component} from 'react';
import classes from './Modal.module.css';
import Aux from '../../../hoc/Aux';
import Backdrop from '../Backdrop/Backdrop';


class Modal extends Component{
    // performance tuning - don't render unless modal is visible, or switching visibility
    shouldComponentUpdate(nextProps, nextState){
        if(this.props.show || this.props.show !== nextProps.show){
            return true;
        }
        return false;
    }

    render() {
        return (
            <Aux>
                <Backdrop 
                    show={this.props.show} 
                    clicked={this.props.modalClosed}
                />
                <div 
                    className={classes.Modal}
                    style={
                        {
                            transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                            opacity: this.props.show ? '1' : '0'
                        }
                    }
                >
                    {this.props.children}
                </div>
            </Aux>
        );
    }
}

export default Modal;