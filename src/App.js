import React, { Component } from 'react';
import './App.css';

import AceEditor from 'react-ace';
 
import 'brace/mode/java';
import 'brace/theme/dracula';

class App extends Component {

  constructor() {
    super();

    this.state = {
      problemName: "TP-1 SDA 2019",
      code: "",
      buttonDisabled: false,
      submissionStatus: "",
      input: "",
      hasil: {
        run_status: {
          output: ""
        }
      },
      output: ""
    }
  }

  onChange = (newValue) => {
    this.setState({ code: newValue });
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
        return;
      }
      this.setState({ buttonDisabled: false, input: data.input, hasil: data.hasil, output: data.output }, () => {
        if (data.hasil.compile_status !== "OK") {
          this.setState({ submissionStatus: data.hasil.compile_status });
        } else if (data.hasil.run_status.status !== "AC") {
          this.setState({ submissionStatus: data.hasil.run_status.status });
        } else if (data.hasil.run_status.output === data.output) {
          this.setState({ submissionStatus: "AC" });
        } else {
          this.setState({ submissionStatus: "WA" });
        }
      });
    });
  }

  getIOResult = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h3 className="text-center">Test Case 1</h3>
          </div>
        </div>
        <div className="row">
          <div className="col">
            {
              this.state.submissionStatus === "AC" ?
                <h4>Status: <span style={{ color: "#a3ffa3" }}>AC</span></h4>
              :
                <h4>Status: <span style={{ color: "#fa7979" }}>{this.state.submissionStatus}</span></h4>
            }
          </div>
        </div>
        <div className="row pt-2">
          <div className="col-lg-4">
            Input:
            <div className="card card-body">{this.state.input}</div>
          </div>
          <div className="col-lg-4">
            Expected Output:
            <div className="card card-body">{this.state.output}</div>
          </div>
          <div className="col-lg-4">
            Program Output:
            <div className="card card-body">{this.state.hasil.run_status.output}</div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="App container">
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
            <div className="bottom">
              {
                this.state.buttonDisabled ?
                  <button type="button" className="btn btn-dark submit-btn" disabled>Loading...</button>
                :
                  <button type="button" className="btn btn-dark submit-btn" onClick={this.submitCode}>Submit</button>
              }
            </div>
            <div className="hasil">
              {
                this.state.submissionStatus === "" ?
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
