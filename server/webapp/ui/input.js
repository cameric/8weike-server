import React from 'react';
import noop from 'lodash/noop';
import TextField from 'material-ui/TextField';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: '',
    }
  }

  _validateInput(inputValue) {
    if (this.props.isRequired && inputValue === '') {
      this.setState({
        errorText: 'This field is required!',
      })
    } else {
      for (const v of this.props.validators) {
        if (!v.validator(inputValue)) {
          this.setState({
            errorText: v.errorText,
          });
          return;
        }
      }
      this.setState({
        errorText: '',
      });
    }
  }

  _handleInputChange(event) {
    const inputValue = event.target.value.toString();
    this._validateInput(inputValue);
    this.props.onChange(inputValue);
  }

  _handleInputBlur(event) {
    const inputValue = event.target.value.toString();
    this._validateInput(inputValue);
    this.props.onBlur(inputValue);
  }

  render() {
    return (
      <TextField type={this.props.type}
                 value={this.props.value}
                 className={this.props.className}
                 style={ {
                   width: '',
                   minWidth: '100px',
                 } }
                 disabled={this.props.disabled}
                 errorText={this.state.errorText}
                 errorStyle={ {
                   top: '5px',
                   marginTop: '-20px',
                 } }
                 floatingLabelText={this.props.hintText}
                 onChange={this._handleInputChange.bind(this)}
                 onBlur={this._handleInputBlur.bind(this)}
      >
        {this.props.children}
      </TextField>
    )
  }
};

Input.propTypes = {
  type: React.PropTypes.oneOf(['text', 'password']),
  value: React.PropTypes.string,
  className: React.PropTypes.string,
  isRequired: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  hintText: React.PropTypes.string,
  validators: React.PropTypes.arrayOf(React.PropTypes.shape({
    validator: React.PropTypes.func,
    errorText: React.PropTypes.string,
  })),
  onChange: React.PropTypes.func,
  onBlur: React.PropTypes.func,
};

Input.defaultProps = {
  type: 'text',
  value: '',
  isRequired: false,
  className: null,
  disabled: false,
  hintText: '',
  validators: [],
  onChange: noop,
  onBlur: noop,
};

export default Input;
