import React, { Component } from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import Warning from './Warning';
import './App.css';

let projects = [
]

const defaultValues = {
  date: new Date().toISOString().substring(0, 10),
  project: '',
  hours: null,
  definition:''
}

let insertValue = 0;
let data = [];

class App extends Component {
  state={
    rawData: undefined,
    data: [{
      date: new Date().toISOString().substring(0, 10),
      project: projects[0],
      hours: null,
      definition:''
    }],
    insertValue: 1,
    warningModal: false,
    mainModal: false,
    modalMessage: '',
    modalYesButtonText: 'Yes',
    modalNoButtonText: 'No',
    editing: false,
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
  }

  componentDidUpdate = (prevState, prevProps) => {
    if(prevState.amount !== this.state.amount){
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
      this.setState(prevState => ({data: [...prevState.data, {
        date: new Date().toISOString().substring(0, 10),
        project: projects[0],
        hours: null,
        definition:''
      }]}))
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
    if(e.target.value > 8){
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
    sessionStorage.setItem('tempData', JSON.stringify(this.state.data))
    console.log(this.state.data);
    this.toggleMainModal();
  }

  cancelData = () => {
    this.toggle();
    this.setState({modalMessage: "Are you sure you want to cancel? Not saved data will be lost", editing: false})
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
        <button type="button" className="btn btn-primary" onClick={this.toggleMainModal}>Open Modal</button>
        <Modal isOpen={this.state.mainModal} toggle={this.toggleMainModal} className="main-modal modal-lg">
          <ModalHeader toggle={this.toggleMainModal}>Modal title</ModalHeader>
          <ModalBody>
          <div className="container">
                  <form>
                    <table>
                      <tbody>
                        <tr><th>Date</th><th>Project</th><th>Hours</th><th>Definition</th><th></th></tr>
                        {
                          this.state.data.map((obj, key) => (
                            <tr key={key}>
                              <td><input type="date" value={this.state.data[key].date} onChange={(e) => this.setDate(e, key)}/></td>
                              <td>
                                <select value={this.state.data[key].project} onChange={e => this.setProject(e, key)}>
                                  { projects.map((prj, index) => (
                                    <option key={index} value={prj}>{prj}</option>
                                  ))}
                                </select>
                              </td>
                              <td><input value={this.state.data[key].hours} type="number" min="1" max="24" required onChange={e => this.setHours(e, key)}/></td>
                              <td><input value={this.state.data[key].definition} type="text" onChange={e => this.setDefinition(e, key)}/></td>
                              <td>{ key===0 ? '' : <button className="btn" onClick={(e) => this.deleteRow(e, key)}>Delete</button>}</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                    <div class="container d-flex justify-content-center p-2">
                      <button className="btn mr-2" onClick={this.addRows} >Add</button>
                      <input type="number" min="1" max="10" className="text-center" value={this.state.insertValue} onChange={(e) => {this.setState({insertValue: parseInt(e.target.value, 10)})}} />
                    </div>
                  </form>
                </div>
                <Warning modal={this.state.warningModal} toggle={this.toggle} message={this.state.modalMessage} proceed={this.state.editing ? () => {} : this.toggleMainModal} ok={this.state.modalYesButtonText} decline={this.state.modalNoButtonText}/>
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn btn-secondary" onClick={this.cancelData} >Close</button>
              <button type="button" className="btn btn-primary" onClick={this.saveData}>Save changes</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default App;
