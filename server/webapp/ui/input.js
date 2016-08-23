import React from 'react';
import TextField from 'material-ui/TextField';

class Input extends React.Component {
  render() {
    return (
      <TextField className={this.props.classNames}
                 disabled={this.props.disabled}
                 errorText={this.props.errorText}
                 floatingLabelText={this.props.hintText}
                 onChange={this.props.onChange}>
        {this.props.children}
      </TextField>
    )
  }
};

Input.propTypes = {
  classNames: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  errorText: React.PropTypes.string,
  hintText: React.PropTypes.string,
  onChange: React.PropTypes.func,
};

export default Input;
