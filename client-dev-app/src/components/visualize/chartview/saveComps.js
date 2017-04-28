import React, { PropTypes, Component } from 'react';


export class InitSave extends Component {
  constructor(props){
    super(props);
    this.state = {
      vizName: ""
    };
  }

  handleChange(e){
    this.setState({
      vizName: e.target.value
    });
  }
  

  render () {
    return (
      <div>
        <h4> Name Your Visualization</h4>
        <input onChange={this.handleChange.bind(this)} type="text" value={this.state.vizName}></input><br/>    
        <button className="bld-name-save" onClick={() => {this.props.saveViz(this.state.vizName)}}>Save</button>
        <button className="bld-save-close" onClick={() => {this.props.closeSave()}}>Close</button>
      </div>
    );
  }
}

InitSave.PropTypes = {
  closeSave: PropTypes.func.isRequired,
  saveViz: PropTypes.func.isRequired
};

export class SaveReport extends Component {

  render () {
    return (
      <div>
        <h4> Your visualization was saved succesfully</h4>

        <input type="text" value={`http://find.state.gov/visualize?id=${this.props.savedVizID}`}></input><br/>

        <h4> Share It</h4>
        <div className="social-nav">
          <a href={`http://twitter.com/home?status=FIND http://find.state.gov/visualize?id=${this.props.savedVizID}`}><span className="save-social tweet"></span></a>
          <a href={`http://www.facebook.com/share.php?u=http://find.state.gov/visualize?id=${this.props.savedVizID}&title=FIND`}><span className="save-social fbook"></span></a>
          <a href="mailto:"><span className="save-social mail"></span></a>
        </div>
        <button className="bld-save-close" onClick={() => {this.props.closeSave()}}>Close</button>
      </div>
    );
  }
}

SaveReport.PropTypes = {
  closeSave: PropTypes.func.isRequired,
  savedVizID: PropTypes.number.isRequired
};