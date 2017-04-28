import React, { Component } from 'react';
import {InitSave, SaveReport} from './saveComps';
import { Modal, Alert } from 'react-bootstrap';

/**
 * Resuls row
 * 
 * @class ACResultsRow
 * @extends {Component}
 */
class SaveModal extends Component {

  render () {
    const {
      savingViz,
      vizSaved,
      saveViz,
      closeSave,
      savedVizID,
      saveModal
    } = this.props;

    return (
      <Modal className="save-modal" show={saveModal}>  
          <div className="save-modal-content">
              {savingViz == false && vizSaved == false ? <InitSave  saveViz={saveViz} closeSave={closeSave} /> :
                  savingViz == true ? <div className="loading"></div> :
                    <SaveReport savedVizID={savedVizID} closeSave={closeSave} />
              }
          </div>
      </Modal>
    );
  }
}

export default SaveModal;