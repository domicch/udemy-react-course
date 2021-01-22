import React, {Component} from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux';

const withErrorHandler = (WrappedComponent, axios) => {
    //anonymous class
    return class extends Component{
        // state = {
        //     error: null
        // }

        // componentWillMount() {
            
        //     // clear error whenever request is sent
        //     axios.interceptors.request.use(req => {
        //         console.log('withErrorHandler intercept request');
        //         this.setState({error: null});
        //         return req;
        //     });

        //     axios.interceptors.response.use(res => res, error => {
        //         console.log('withErrorHandler intercept response');
        //         this.setState({error: error});
        //         return Promise.reject(error);
        //     });
        // }

        constructor (props) {
            super(props);

            console.log('withErrorHandler constructor');

            this.state = {
                error: null
            };

            // clear error whenever request is sent
            this.reqInterceptor = axios.interceptors.request.use(req => {
                console.log('withErrorHandler intercept request');
                this.setState({error: null});
                return req;
            });

            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                console.log('withErrorHandler intercept response');
                this.setState({error: error});
                return Promise.reject(error);
            });
        }

        componentDidMount() {
            console.log('withErrorHandler componentDidMount()');
        }

        componentWillUnmount() {
            // to ensure that axios interceptors are removed when component is unmount to prevent memory leak
            console.log(this.reqInterceptor, this.resInterceptor);
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        clearErrorHandler = () => {
            this.setState({error: null});
        }

        render() {
            return (
                <Aux>
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.clearErrorHandler}
                    >
                        {this.state.error?this.state.error.message: null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
                
            );
        }
    }
}

export default withErrorHandler;