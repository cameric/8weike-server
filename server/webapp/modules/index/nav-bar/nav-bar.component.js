import React from 'react';

import UserAuth from './user-auth';

require('../../../stylesheets/modules/nav-bar.scss');

class NavBar extends React.Component {
  render() {
    return (
      <div className="nav-bar">
        <div className="regular-header">
          <span className="nav-bar__logo">8WeiKe</span>
          <UserAuth />
        </div>
      </div>
    );
  }
}

export default NavBar;
