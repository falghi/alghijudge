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
      code: ""
    }
  }

  onChange = (newValue) => {
    this.setState({ code: newValue });
  }

  submitCode = () => {
    fetch(process.env.REACT_APP_API_URL + '/submitcode', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        problemName: this.state.problemName,
        code: this.state.code
      })
    });
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
              <button type="button" className="btn btn-dark submit-btn" onClick={this.submitCode}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
