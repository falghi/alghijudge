import React, { Component } from 'react';
import './App.css';

import AceEditor from 'react-ace';

import 'brace/mode/java';
import 'brace/theme/dracula';

class App extends Component {

  constructor() {
    super();

    this.state = {
      problemName: "TP-2 SDA 2019",
      code: "",
      buttonDisabled: false,
      data: [],
      showIO: []
    }
  }

  onChange = (newValue) => {
    this.setState({ code: newValue });
  }

  checkCode = (recordName) => {
    fetch(process.env.REACT_APP_API_URL + '/checksubmit', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        recordName: recordName
      })
    }).then(resp => resp.json())
    .then(data => {
      if (data.failed) {
       throw new Error(data.failed);
      }
      let showIO = Array.from(this.state.showIO);
      for (let i = 0; i < data.result.length - showIO.length; ++i) showIO.push(false);
      this.setState({ data: data.result, showIO: showIO });
      if (data.finished) {
        this.setState({ buttonDisabled: false });
      } else {
        setTimeout(() => this.checkCode(recordName), 1000);
      }
    }).catch(err => {
      this.setState({ buttonDisabled: false });
      alert("Submit Failed");
    })
  }

  submitCode = () => {
    this.setState({ buttonDisabled: true });
    fetch(process.env.REACT_APP_API_URL + '/submitcode', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        problemName: this.state.problemName,
        code: this.state.code
      })
    }).then(resp => resp.json())
    .then(data => {
      if (data === "failed") {
        this.setState({ buttonDisabled: false });
        alert("Submit Failed");
      } else {
        this.setState({ showIO: [] });
        this.checkCode(data.recordName);
      }
    }).catch(err => {
      this.setState({ buttonDisabled: false });
      alert("Submit Failed");
    });
  }

  toggleIO = (index) => {
    let showIO = Array.from(this.state.showIO);
    showIO[index] ^= true;
    this.setState({ showIO: showIO });
  }

  getIOResult = () => {
    let index = 0;
    return this.state.data.map(value => {
      let idx = ++index;
      return (
        <div key={ idx } className="container">
          <div className="row">
            <div className="col">
              <h3 className="text-center">Test Case { idx }</h3>
            </div>
          </div>
          <div className="row">
            <div className="col">
              {
                value.isAccepted === "AC" ?
                  <h4>Status: <span style={{ color: "#a3ffa3" }}>AC</span></h4>
                :
                  <h4>Status: <span style={{ color: "#fa7979" }}>{value.isAccepted}</span></h4>
              }
              {
                this.state.showIO[idx] ?
                <button type="button" className="btn btn-dark show-btn w-100" onClick={() => this.toggleIO(idx)}>
                  Hide Input/Output
                </button>
                :
                <button type="button" className="btn btn-dark show-btn w-100" onClick={() => this.toggleIO(idx)}>
                  Show Input/Output
                </button>
              }
            </div>
          </div>
          {
            this.state.showIO[idx] ?
              <div className="row pt-2">
                <div className="col-lg-4">
                  Input:
                  <div className="card card-body">{value.input}</div>
                </div>
                <div className="col-lg-4">
                  Expected Output:
                  <div className="card card-body">{value.expectedOutput}</div>
                </div>
                <div className="col-lg-4">
                  Program Output:
                  <div className="card card-body">{value.programOutput.stdout}</div>
                </div>
              </div>
            :
              <span></span>
          }
        </div>
      )
    });
  }

  render() {
    return (
      <div className="App container">
        {/* <a href={ process.env.REACT_APP_API_URL + '/login' }>Login</a> */}
        <div className="row">
          <div className="col">
            <h2 className="title">AlghiJudge</h2>
            <div className="problem-name">
              <div className="dropdown">
                <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {this.state.problemName}
               
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <button className="dropdown-item" onClick={() => this.setState({ problemName: "TP-1 SDA 2019"})}>TP-1 SDA 2019</button>
                  <button className="dropdown-item" onClick={() => this.setState({ problemName: "TP-2 SDA 2019"})}>TP-2 SDA 2019</button>
                </div>
              </div>
            </div>
            <div className="text-editor">
              <AceEditor
                showPrintMargin={false}
                mode="java"
                theme="dracula"
                onChange={this.onChange}
                fontSize={16}
                width="100%"
                name="text-editor"
                editorProps={{$blockScrolling: true}}
                value={this.state.code}
              />
            </div>
            <div className="row bottom">
              <div className="col-md-6 text-left">
                <a className="tc-link" href="https://github.com/darklordace/alghijudge-api/tree/master/static">Test Cases</a>
              </div>
              <div className="col-md-6 text-right">
                {
                  this.state.buttonDisabled ?
                    <button type="button" className="btn btn-dark submit-btn" disabled>Loading...</button>
                  :
                    <button type="button" className="btn btn-dark submit-btn" onClick={this.submitCode}>Submit</button>
                }
              </div>
            </div>
            <div className="hasil">
              {
                this.state.data === [] ?
                  <span></span>
                :
                  this.getIOResult()
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
