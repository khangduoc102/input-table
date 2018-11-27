import React, { Component } from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import Warning from './Warning';
import './App.css';

import axios from 'axios';


export default class Edit extends Component {
    state={
        data : undefined,
        error: undefined,
        warningModal: false,
        modalMessage: '',
        editing: false,
        overLimitObjectIndex: null,
        modalYesButtonText: 'Yes',
        modalNoButtonText: 'No'
    }

    componentDidMount = () => {
        console.log(this.state.data);
        
    }

    toggleWarningModal = () => {
        this.setState({warningModal: !this.state.warningModal})
    }

    componentDidUpdate= (prevProps, prevState) => {
        if(prevProps.workHours !== this.props.workHours){
            let data = []
            this.props.workHours.map((workHour) => {
                data.push({...workHour, edit: false})
            })
            this.setState({data: data})
        }
    }

    setDate= (e, key) => {
        let newData = this.state.data;
        newData.map((obj, index)=>{
          if(index === key){
            obj.Date = e.target.value
            obj.edit = true
          }
          return ''
        })
        this.setState(() => ({data: newData}))
    }
    
    setProject= (e, key) => {
        let newData = this.state.data;
        newData.map((obj, index)=>{
          if(index === key){
            obj.Project = e.target.value
            obj.edit = true
          }
          return ''
        })
        this.setState(() => ({data: newData}))
    }
    
    setHours= (e, key) => {
        let regex = /^[0-9.,]+$/
        if(!e.target.value || e.target.value.match(regex)){
          
            if(parseFloat(e.target.value.replace(',','.').replace(' ','')) > (Number.parseFloat(this.props.hoursPerWeek) / 5)){
                this.toggleWarningModal();
                this.setState({modalMessage: `Are you sure you want to insert more than ${Number.parseFloat(Number.parseFloat(this.props.hoursPerWeek) / 5).toFixed(1)} hours?`, editing: true})
                this.setState({overLimitObjectIndex: key})
            }
            let newData = this.state.data;
            newData.map((obj, index)=>{
                if(index === key){
                obj.Hour = e.target.value
                obj.edit = true
                }
                return ''
            })
            this.setState( () =>  ({data: newData}))
        }
    }
    
    cancelLimitHour = (key) => {
        let newData = this.state.data;
        newData.map((obj, index)=>{
            if(index === key){
                obj.Hour = Number.parseFloat(Number.parseFloat(this.props.hoursPerWeek) / 5).toFixed(1);
            }
            return ''
        })
        this.setState({data: newData})
    }
    
    setDefinition= (e, key) => {
        let newData = this.state.data;
        newData.map((obj, index)=>{
            if(index === key){
                obj.Description = e.target.value
                obj.edit = true
            }
            return ''
        })
        this.setState( {data: newData})
    }

    saveData= () => {
        let result= [];
        this.state.data.map(obj => {
            if(obj.edit === true){
                result.push(obj)
            }
        })

        console.log(result);
        let fetchResult = [];
        let count = 0;
        result.map(element => {
            if(element.Hour && Number.parseFloat(element.Hour) > 0){
                count++;
                let query = `project=${element.Project}&hours=${element.Hour.replace(',','.').replace(' ','')}&date=${element.Date}&definition=${element.Description}&id=${element.id}`;
                console.log(query)
                axios.get('php/editTime.php?'+query).then(res => {
                    if(res.status === 200){
                        fetchResult.push('ok');
                    }
                })
            }
        })
        window.setInterval(() =>{
            if(fetchResult.length === count){
                this.setState({data: []})
                this.props.toggleEditModal();         
                window.location.reload();
            }
            else{
                this.setState({error: "Executing..."})
            }
        }, 1000)   
    }

    cancelData = () => {
        this.setState({modalMessage: "Are you sure you want to cancel? Saved process will be lost", editing: false, error: undefined})
        this.toggleWarningModal();
    }

    clearData = () => {
        this.setState({data: this.props.workHours})
    }

    render() {
        return (
            <Modal isOpen={this.props.editModal} toggle={this.props.toggleEditModal} className="modal-lg main-modal ">
                <ModalHeader toggle={this.props.toggleEditModal} charCode="" >Edit entries</ModalHeader>
                <ModalBody>
                    <div className="container ">
                        <form className="d-flex justify-content-center">
                            <table  style={{width: '100%'}}>
                            <tbody  style={{width: '100%'}}>
                                <tr><th style={{width: '25%'}}>Date</th><th style={{width: '25%'}}>Project</th><th style={{width: '10%'}}>Hours</th><th style={{width: '40%'}}>Definition</th></tr>
                                {
                                this.state.data && this.state.data.map((obj, key) => (
                                    <tr key={key}>
                                    <td><input style={{width: '100%'}} type="date" value={this.state.data[key].Date} onChange={(e) => this.setDate(e, key)}/></td>
                                    <td>
                                        <select value={this.state.data[key].Project} onChange={e => this.setProject(e, key)}>
                                        { this.props.projects.map((prj, index) => (
                                            <option key={index} value={prj}>{prj}</option>
                                        ))}
                                        </select>
                                    </td>
                                    <td><input style={{width: '100%'}} value={this.state.data[key].Hour} size="5" type="text" required onChange={e => this.setHours(e, key)}/></td>
                                    <td><input style={{width: '100%'}} value={this.state.data[key].Description} type="text" onChange={e => this.setDefinition(e, key)}/></td>
                                    </tr>
                                ))
                                }
                            </tbody>
                            </table>
                        </form>
                        <div>
                            {this.state.error ? <p className="text-center text-danger font-weight-bold">{this.state.error}</p> : ''}
                        </div>
                        <Warning modal={this.state.warningModal} toggle={this.toggleWarningModal} message={this.state.modalMessage} proceed={this.state.editing ? () => {} : () => {this.props.toggleEditModal(); this.clearData()}} declineCallback={this.state.editing ? () => this.cancelLimitHour(this.state.overLimitObjectIndex) : () => {} } ok={this.state.modalYesButtonText} decline={this.state.modalNoButtonText}/>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-secondary" onClick={this.cancelData}>Cancel</button>
                    <button type="button" className="btn btn-primary" onClick={this.saveData}>Save changes</button>
                </ModalFooter>
            </Modal>
        )
    }
}