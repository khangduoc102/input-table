import React, { Component } from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import Warning from './Warning';
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
    data: defaultData,
    insertValue: 1,
    warningModal: false,
    mainModal: false,
    modalMessage: '',
    modalYesButtonText: 'Yes',
    modalNoButtonText: 'No',
    editing: false,
    error: undefined,
    newValue:{},
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

  componentDidMount = () => {
    this.setState({ rawData: JSON.parse(sessionStorage.getItem('data'))})
    JSON.parse(sessionStorage.getItem('data')).map((prj) => {
      projects.push(prj.Project_ID)
    })
    this.setState({data: [{
      date: new Date().toISOString().substring(0, 10),
      project: projects[0],
      hours: null,
      definition:''
    }]})
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(prevState.data.length !== this.state.data.length){
      /*
      insertValue=this.state.insertValue
      for(let i=0; i< insertValue; i++){
        this.setState(() => ({...this.state, ['date' + (this.state.amount+i)]: defaultValues.date, ['project' + (this.state.amount+i)]: defaultValues.project, ['hours' + (this.state.amount+i)]: defaultValues.hours, ['description' + (this.state.amount+i)]: defaultValues.description}))
      } 
      console.log(this.state)
      */
    }
  }


  addRows= (e) => {
    e.preventDefault(); 
    for(let i=0; i< this.state.insertValue; i++){
      this.setState(prevState => ({data: [...prevState.data, new defaultValues(this.state.data[this.state.data.length-1].date, this.state.data[this.state.data.length-1].project, this.state.data[this.state.data.length-1].hours, this.state.data[this.state.data.length-1].definition)]}))
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
    this.setState( {data: newData})
  }

  setProject= (e, key) => {
    let newData = this.state.data;
    newData.map((obj, index)=>{
      if(index === key){
        obj.project = e.target.value
      }
      return ''
    })
    this.setState( {data: newData})
  }

  setHours= (e, key) => {
    let regex = /^[0-9.,]+$/
    if(!e.target.value || e.target.value.match(regex)){
      
      if(parseFloat(e.target.value.replace(',','.').replace(' ','')) > 8){
        this.toggle();
        this.setState({modalMessage: "Are you sure you want to insert more than 8 hours?", editing: true})
      }
      let newData = this.state.data;
      newData.map((obj, index)=>{
        if(index === key){
          obj.hours = e.target.value
        }
        return ''
      })
      this.setState( {data: newData})
    }
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
      /*
      xmlhttp=new XMLHttpRequest(); 
      xmlhttp.onreadystatechange=function(){
        if(xmlhttp.status === 200){
          res.push('OK');
          
        }
      }
      xmlhttp.open("GET","/php/logTime.php?" + query,true);
      xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xmlhttp.send();
      */
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
            window.location.reload();
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
    this.setState({data: defaultData})
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
                  <div class="container d-flex justify-content-center p-2">
                      <button className="btn btn-info mr-2" onClick={this.addRows} >Add</button>
                      <input type="number" min="1" max="10" className="text-center" value={this.state.insertValue} onChange={(e) => {this.setState({insertValue: parseInt(e.target.value, 10)})}} />
                  </div>
                  <div>
                    {this.state.error ? <p className="text-center text-danger font-weight-bold">{this.state.error}</p> : ''}
                  </div>
                </div>
                <Warning modal={this.state.warningModal} toggle={this.toggle} message={this.state.modalMessage} proceed={this.state.editing ? () => {} : () => {this.toggleMainModal(); this.clearData()}} ok={this.state.modalYesButtonText} decline={this.state.modalNoButtonText}/>
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn btn-secondary" onClick={this.cancelData} >Cancel</button>
              <button type="button" className="btn btn-primary" onClick={this.saveData}>Save changes</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default App;
