import React from 'react';
import Input from '../../ui/input';

class SignupModalContent extends React.Component {
  render() {
    return (
      <div>
        <Input hintText="Phone Number"/>
        <Input hintText="Password"/>
        <Input hintText="Confirm Password"/>
        <button>Sign Up</button>
        <span>Already a member? Sign in</span>
      </div>
    )
  }
}

export default SignupModalContent;
