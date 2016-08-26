import React from 'react';
import ContentBlock from 'material-ui/svg-icons/content/block'
import { white } from 'material-ui/styles/colors';

require('../stylesheets/modules/ui/error-banner.scss');

class ErrorBanner extends React.Component {
  render() {
    return (
      <div className="error-banner">
        <div className="error-banner__icon-container">
          <ContentBlock color={white}/>
        </div>
        <span className="error-banner__error-msg">
          {this.props.errorMsg}
        </span>
      </div>
    )
  }
}

ErrorBanner.propTypes = {
  errorMsg: React.PropTypes.string
};

export default ErrorBanner
