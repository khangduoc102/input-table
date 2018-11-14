import React, { Component } from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

export default class Warning extends Component {
    proceed =  () => {
        this.props.proceed();
        this.props.toggle()
    }
    render() {
        return (
            <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
                <ModalHeader toggle={this.props.toggle}>Modal title</ModalHeader>
                <ModalBody>
                    <p>{this.props.message}</p>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-secondary" onClick={this.props.toggle}>{this.props.decline}</button>
                    <button className="btn btn-primary" onClick={this.proceed}>{this.props.ok}</button>{' '}
                    
                </ModalFooter>
            </Modal>
        )
    }
}