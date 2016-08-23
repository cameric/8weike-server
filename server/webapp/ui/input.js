import React from 'react';
import noop from 'lodash/noop';
import TextField from 'material-ui/TextField';

class Input extends React.Component {
  render() {
    return (
      <TextField type={this.props.type}
                 className={this.props.classNames}
                 style={ {
                   width: '',
                   minWidth: '100px',
                 } }
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
  type: React.PropTypes.oneOf(['text', 'password']),
  classNames: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  errorText: React.PropTypes.string,
  hintText: React.PropTypes.string,
  onChange: React.PropTypes.func,
};

Input.defaultProps = {
  type: 'text',
  classNames: null,
  disabled: false,
  errorText: '',
  hintText: '',
  onChange: noop
};

export default Input;
