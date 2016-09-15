import React from 'react';

import LocaleSelector from './locale-selector';

require('../../stylesheets/modules/locale-selector.scss');

class Footer extends React.Component {
  _changeLocale(locale) {
    this.props.setLocale(locale);
  }

  _renderLocaleSelectBtn(msg, locale) {
    return (
      <button className='button-as-link'
              onClick={this._changeLocale.bind(this, locale)}>{msg}</button>
    )
  }

  render() {
    return (
      <div className='locale-selector'>
        {this._renderLocaleSelectBtn('简体中文', 'zh')}
        <span> | </span>
        {this._renderLocaleSelectBtn('English', 'en')}
      </div>
    )
  }
}

Footer.propTypes = {
  setLocale: React.PropTypes.func.isRequired,
};

export default Footer
