// The Modal component

import React from 'react';
import noop from 'lodash/noop';
import Dialog from 'material-ui/Dialog';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };
  }

  _createTargetButton() {
    return React.cloneElement(this.props.targetButton, {
      onClick: () => this._toggleVisibility()
    })
  }

  _toggleVisibility() {
    this.setState({isVisible: !this.state.isVisible});
  }

  _closeModal() {
    this.props.onClose();
    this._toggleVisibility();
  }

  render() {
    return (
      <div>
        {this._createTargetButton()}
        <Dialog contentClassName={this.props.classNames}
                contentStyle={ {
                  width: ''
                } }
                open={this.state.isVisible}
                onRequestClose={this._closeModal.bind(this)}
                title={this.props.title}
                autoScrollBodyContent={this.props.isContentScrollable}>
          {this.props.children}
        </Dialog>
      </div>
    )
  }
}

Modal.propTypes = {
  targetButton: React.PropTypes.element.isRequired,
  title: React.PropTypes.string,
  classNames: React.PropTypes.string, // No inline style permitted
  onClose: React.PropTypes.func,
  isContentScrollable: React.PropTypes.bool
};

Modal.defaultProps = {
  isContentScrollable: true,
  onClose: noop,
};

export default Modal
