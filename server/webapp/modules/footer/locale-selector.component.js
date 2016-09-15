import React from 'react';

require('../../stylesheets/modules/locale-selector.scss');

class LocaleSelector extends React.Component {
  _renderLocaleSelectBtn(msg, locale) {
    return (
      <button className='button-as-link'
              onClick={() => { this.props.setLocale(locale); }}>{msg}</button>
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

LocaleSelector.propTypes = {
  setLocale: React.PropTypes.func.isRequired,
};

export default LocaleSelector
