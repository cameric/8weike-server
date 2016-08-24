// A set of action creators for user authentication

import { createAction } from 'redux-actions';

export const signupWithPhoneBasicInfoAction = createAction('SIGNUP_WITH_PHONE_BASIC_INFO');

export const signupWithPhoneTFAAction = createAction('SIGNUP_WITH_PHONE_TFA');

export const signupWithPhoneUsernameAction = createAction('SIGNUP_WITH_PHONE_USERNAME');