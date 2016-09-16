import React from 'react';
import ReactDOM from 'react-dom';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import LinearProgress from 'material-ui/LinearProgress';
import Divider from 'material-ui/Divider';
import zxcvbn from 'zxcvbn';

require('../../../../stylesheets/modules/password-strength.scss');

class PasswordStrengthMeter extends React.Component {
  constructor(props) {
    super(props);
    this.strengthMappings = {
      0: {
        label: __('Worst'),
        color: '#CB1702',
      },
      1: {
        label: __('Bad'),
        color: '#FF7900',
      },
      2: {
        label: __('Weak'),
        color: '#FFCC00',
      },
      3: {
        label: __('Good'),
        color: '#DDFE00',
      },
      4: {
        label: __('Strong'),
        color: '#91CA00',
      },
    };

    this.state = {
      isVisible: false,
    };

    this.strength = {
      score: 0,
      warning: '',
    };
  }

  componentDidMount() {
    this.targetButton = ReactDOM.findDOMNode(this.refs.strengthMeterButton);
  }

  componentDidUpdate() {
    const newStrength = zxcvbn(this.props.password);
    this.strength.score = newStrength.score;
    this.strength.warning = newStrength.feedback.warning;
  }

  _closeStrengthMeter() {
    this.setState({ isVisible: false });
  }

  _toggleStrengthMeter(e) {
    e.preventDefault();
    this.setState({ isVisible: !this.state.isVisible });
  }

  _renderWarning() {
    if (this.strength.warning !== '') {
      return (
        <p className="password-strength__warning">
          <b>Explanation: </b>
          {this.strength.warning}
        </p>
      );
    }
    return null;
  }

  render() {
    return (
      <div className={this.props.classNames}>
        <FlatButton
          ref="strengthMeterButton"
          onTouchTap={this._toggleStrengthMeter.bind(this)}
          style={{
            minWidth: 0,
            width: '30px',
            height: '33px',
          }}
        >
          <div className="password-strength-target-icon"></div>
        </FlatButton>
        <Popover
          anchorEl={this.targetButton}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          onRequestClose={this._closeStrengthMeter.bind(this)}
          open={this.state.isVisible}
          targetOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <div className="password-strength">
            <h4 className="password-strength__title">{__('Password Strength Meter')}</h4>
            <Divider />
            <span className="password-strength__label">
              {__('Your password is: ')}{this.strengthMappings[this.strength.score].label}
            </span>
            <LinearProgress
              mode="determinate"
              value={parseInt(this.strength.score, 10)}
              color={this.strengthMappings[this.strength.score].color}
              min={0}
              max={4}
              style={{
                marginBottom: '10px',
              }}
            />
            {this._renderWarning()}
          </div>
        </Popover>
      </div>
    );
  }
}

PasswordStrengthMeter.propTypes = {
  password: React.PropTypes.string,
  classNames: React.PropTypes.string,
};

export default PasswordStrengthMeter;
