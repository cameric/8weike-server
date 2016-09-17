import React from 'react';

import LocaleSelector from './locale-selector';

require('../../stylesheets/modules/footer.scss');

class Footer extends React.Component {
  render() {
    return (
      <div className="footer">
        <LocaleSelector />
      </div>
    );
  }
}

export default Footer;
