import React from 'react';

class CountDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: this.props.duration,
      countdown: null,
    }
  }

  componentDidMount() {
    const countdown = setInterval(() => {
      this.setState({ timer: --this.state.timer });
    }, 1000);

    this.setState({ countdown });
  }

  componentDidUpdate() {
    if (this.state.timer == 0) {
      clearInterval(this.state.countdown);
      this.props.onFinished();
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.countdown);
  }

  render() {
    return (
        <span>{this.state.timer}</span>
    )
  }
}

CountDown.propTypes = {
  duration: React.PropTypes.number,
  onFinished: React.PropTypes.func,
};

export default CountDown

