import React, { Component } from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import Warning from './Warning';
import Edit from './Edit';
import './App.css';

let projects = [
]

const defaultValues = class {
  constructor(date, project, hours, definition) {
    this.date=date;
    this.project=project;
    this.hours=hours;
    this.definition= definition;
  }
}

var defaultData = [{
  date: new Date().toISOString().substring(0, 10),
  project: '',
  hours: "1",
  definition:''
}]
let insertValue = 0;
let data = [];

class App extends Component {
  state={
    rawData: undefined,
    data: [],
    insertValue: 1,
    warningModal: false,
    mainModal: false,
    editModal: false,
    modalMessage: '',
    modalYesButtonText: 'Yes',
    modalNoButtonText: 'No',
    editing: false,
    error: undefined,
    newValue:{},
    workHours: [],
    hoursPerWeek: undefined,
    nextDate: new Date().toISOString().substring(0, 10),
    nextHour: undefined,
    overLimitObjectIndex: undefined
  }

  toggle = () => {
    this.setState({
      warningModal: !this.state.warningModal
    });
  }

  toggleMainModal = () => {
    this.setState({
      mainModal: !this.state.mainModal
    });
  }

  toggleEditModal = () => {
    this.setState({
      editModal: !this.state.editModal
    });
  }

  componentDidMount = () => {
    this.setState(() => ({ rawData: JSON.parse(sessionStorage.getItem('data')), workHours: JSON.parse(sessionStorage.getItem('work_hours')), hoursPerWeek: sessionStorage.getItem('hours_per_week')}), () => {this.setNextHour(new Date().toISOString().substring(0, 10));})
    JSON.parse(sessionStorage.getItem('data')).map((prj) => {
      if(prj){
        projects.push(prj.Project_ID);
      }
      else {
        projects.push('');
      }
    })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(prevState.data.length !== this.state.data.length){
     this.setNextHour(this.state.nextDate);
    }
    if(this.state.nextHour !== prevState.nextHour && this.state.data.length === 0){
      if(this.state.workHours.length > 0){
        this.setState(() => ({data: [new defaultValues(this.state.nextDate, this.state.workHours[this.state.workHours.length -1].Project, this.state.nextHour, "")]}), () => {this.setNextHour(this.state.nextDate)})
      }
      else{
        if(projects[0]){
          this.setState(() => ({data: [new defaultValues(this.state.nextDate, projects[0], this.state.nextHour, "")]}), () => {this.setNextHour(this.state.nextDate)})
        }
        else{
          this.setState(() => ({data: [new defaultValues(this.state.nextDate, " ", this.state.nextHour, "")]}), () => {this.setNextHour(this.state.nextDate)})
        }
      }
    }
  }

  setNextHour = (today) => {
    let count= 0;
    let todayDate = new Date(today);
    let tomorrow = new Date(todayDate.setDate(todayDate.getDate() + 1)).toISOString().substring(0, 10);

    let hoursPerDay= Number.parseFloat(Number.parseFloat(this.state.hoursPerWeek) / 5).toFixed(1);
    console.log(hoursPerDay);
    let i=0;
    while (this.state.workHours[i]){
      if(today === this.state.workHours[i].Date) {
        count += Number.parseFloat(this.state.workHours[i].Hour)
      }
      if(count > hoursPerDay || count == hoursPerDay){
        today = tomorrow;

        todayDate = new Date(today);
        tomorrow = new Date(todayDate.setDate(todayDate.getDate() + 1)).toISOString().substring(0, 10);
        
        i = -1;
        count= 0;
      }
      i++
    }
    let k=0;
    while (this.state.data[k]){
      if(today === this.state.data[k].date) {
        count += Number.parseFloat(this.state.data[k].hours.replace(',','.').replace(' ',''))
      }
      if(count > hoursPerDay || count == hoursPerDay){
        today = tomorrow;

        todayDate = new Date(today);
        tomorrow = new Date(todayDate.setDate(todayDate.getDate() + 1)).toISOString().substring(0, 10);
        
        k = -1;
        count= 0;
      }
      k++
    }
    console.log(today);
    let result = hoursPerDay - count;
    if(result > 5){
      result = 5
    }
    this.setState({nextDate: today, nextHour: result.toFixed(1).toString()})
  }

  setNextInputHour = (today) => {
    console.log('run');
    let count= 0;
    let todayDate = new Date(today);
    let tomorrow = new Date(todayDate.setDate(todayDate.getDate() + 1)).toISOString().substring(0, 10);

    let hoursPerDay= Number.parseFloat(Number.parseFloat(this.state.hoursPerWeek) / 5).toFixed(1);
    console.log(hoursPerDay);
    let i=0;
    while (this.state.data[i]){
      if(today === this.state.data[i].date) {
        count += Number.parseFloat(this.state.data[i].hours)
      }
      if(count > hoursPerDay || count == hoursPerDay){
        today = tomorrow;

        todayDate = new Date(today);
        tomorrow = new Date(todayDate.setDate(todayDate.getDate() + 1)).toISOString().substring(0, 10);
        
        i = -1;
        count= 0;
      }
      i++
    }
    console.log(today);
    let result = hoursPerDay - count;
    if(result > 5){
      result = 5
    }
    this.setState({nextDate: today, nextHour: result})
  }

  addRows= (e) => {
    e.preventDefault(); 
    for(let i=0; i< this.state.insertValue; i++){
      this.setState(prevState => ({data: [...prevState.data, new defaultValues(this.state.nextDate, this.state.data[this.state.data.length-1].project, this.state.nextHour, this.state.data[this.state.data.length-1].definition)]}))
    }
  }

  setDate= (e, key) => {
    let newData = this.state.data;
    newData.map((obj, index)=>{
      if(index === key){
        obj.date = e.target.value
      }
      return ''
    })
    this.setState(() => ({data: newData}),  () => {this.setNextHour(this.state.data[key].date)})
  }

  setProject= (e, key) => {
    let newData = this.state.data;
    newData.map((obj, index)=>{
      if(index === key){
        obj.project = e.target.value
      }
      return ''
    })
    this.setState(() => ({data: newData}))
  }

  setHours= (e, key) => {
    let regex = /^[0-9.,]+$/
    if(!e.target.value || e.target.value.match(regex)){
      
      if(parseFloat(e.target.value.replace(',','.').replace(' ','')) > (Number.parseFloat(this.state.hoursPerWeek) / 5)){
        this.toggle();
        this.setState({modalMessage: `Are you sure you want to insert more than ${Number.parseFloat(Number.parseFloat(this.state.hoursPerWeek) / 5).toFixed(1)} hours?`, editing: true})
        this.setState({overLimitObjectIndex: key})
      }
      let newData = this.state.data;
      newData.map((obj, index)=>{
        if(index === key){
          obj.hours = e.target.value
        }
        return ''
      })
      this.setState( () =>  ({data: newData}), () => {this.setNextHour(this.state.data[key].date)})
    }
  }

  cancelLimitHour = (key) => {
    let newData = this.state.data;
    newData.map((obj, index)=>{
      if(index === key){
        obj.hours = Number.parseFloat(Number.parseFloat(this.state.hoursPerWeek) / 5).toFixed(1);
      }
      return ''
    })
    this.setState({data: newData})
  }

  setDefinition= (e, key) => {
    let newData = this.state.data;
    newData.map((obj, index)=>{
      if(index === key){
        obj.definition = e.target.value
      }
      return ''
    })
    this.setState( {data: newData})
  }


  saveData = () => {
    sessionStorage.setItem('resData', JSON.stringify(this.state.data))
    var xmlhttp;
    let query='';
    let resArr = [];
		this.state.data.map((element, index) => {   
      if(element.hours){
        query = `project=${element.project}&hours=${element.hours.replace(',','.').replace(' ','')}&date=${element.date}&definition=${element.definition}`;
        console.log(query)
        fetch('php/logTime.php?'+query, {
          method: "GET",
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
              "Content-Type": "application/x-www-form-urlencoded",
          },
      }).then(res => {
        resArr.push('ok');    
        if(!this.state.data[index+1]){  
          console.log(this.state.data);
          this.setState({error: undefined})
          window.setInterval(() =>{
            this.setState({data: defaultData})
            this.toggleMainModal();         
            //window.location.reload();
          }, 1500)   
        }       
      }).catch(e => {
        console.log(e);
        this.setState({error: "There are some queries that have not been executed!"})
      })
      }
    })
    
  }

  cancelData = () => {
    this.toggle();
    this.setState({modalMessage: "Are you sure you want to cancel? Saved process will be lost", editing: false, error: undefined})
  }

  clearData = () => {
    this.setState(() => ({data: []}), () => {this.setNextHour(new Date().toISOString().substring(0, 10))})
  }

  triggerModal = (e) => {
    this.toggle();
    console.log(e.target);
  }

  deleteRow = (e, key) => {
    e.preventDefault();
    this.setState({data: this.state.data.filter((obj, index) => index!==key)})
  }

  render() {
    return (
      <div className="App">
        <button type="button" className="btn btn-primary" onClick={this.toggleMainModal}>New</button>
        <button type="button" className="btn btn-primary" onClick={this.toggleEditModal}>Edit</button>

        <Modal isOpen={this.state.mainModal} toggle={this.toggleMainModal} className="modal-lg main-modal ">
          <ModalHeader toggle={this.toggleMainModal} charCode="" >Insert entries</ModalHeader>
          <ModalBody>
          <div className="container ">
                  <form className="d-flex justify-content-center">
                    <table  style={{width: '100%'}}>
                      <tbody  style={{width: '100%'}}>
                        <tr><th style={{width: '20%'}}>Date</th><th style={{width: '20%'}}>Project</th><th style={{width: '10%'}}>Hours</th><th style={{width: '40%'}}>Definition</th><th  style={{width: '10%'}}></th></tr>
                        {
                          this.state.data.map((obj, key) => (
                            <tr key={key}>
                              <td><input style={{width: '100%'}} type="date" value={this.state.data[key].date} onChange={(e) => this.setDate(e, key)}/></td>
                              <td>
                                <select value={this.state.data[key].project} onChange={e => this.setProject(e, key)}>
                                  { projects.map((prj, index) => (
                                    <option key={index} value={prj}>{prj}</option>
                                  ))}
                                </select>
                              </td>
                              <td><input style={{width: '100%'}} value={this.state.data[key].hours} size="5" type="text" required onChange={e => this.setHours(e, key)}/></td>
                              <td><input style={{width: '100%'}} value={this.state.data[key].definition} type="text" onChange={e => this.setDefinition(e, key)}/></td>
                              <td>{ key===0 ? '' : <button className="btn btn-danger" onClick={(e) => this.deleteRow(e, key)}>Delete</button>}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </form>
                  <div className="container d-flex justify-content-center p-2">
                      <button className="btn btn-info mr-2" onClick={this.addRows} >Add</button>
                      <input type="number" min="1" max="10" className="text-center" value={this.state.insertValue} onChange={(e) => {this.setState({insertValue: parseInt(e.target.value, 10)})}} />
                  </div>
                  <div>
                    {this.state.error ? <p className="text-center text-danger font-weight-bold">{this.state.error}</p> : ''}
                  </div>
                </div>
                <Warning modal={this.state.warningModal} toggle={this.toggle} message={this.state.modalMessage} proceed={this.state.editing ? () => {} : () => {this.toggleMainModal(); this.clearData()}} declineCallback={this.state.editing ? () => this.cancelLimitHour(this.state.overLimitObjectIndex) : () => {} } ok={this.state.modalYesButtonText} decline={this.state.modalNoButtonText}/>
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn btn-secondary" onClick={this.cancelData} >Cancel</button>
              <button type="button" className="btn btn-primary" onClick={this.saveData}>Save changes</button>
          </ModalFooter>
        </Modal>

        { /* Edit modal */ }
        
            <Edit 
              editModal={this.state.editModal}
              toggleEditModal={this.toggleEditModal}
              workHours={this.state.workHours}
              projects={projects}
              setNextHour={this.setNextHour}
              hoursPerWeek={this.state.hoursPerWeek}
            />
          
      </div>
    );
  }
}

export default App;
