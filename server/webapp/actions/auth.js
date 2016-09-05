// A set of action creators for user authentication

import { createAction } from 'redux-actions';

// Signup action creators

export const signupWithPhoneBasicInfoAction = createAction('SIGNUP_WITH_PHONE_BASIC_INFO');

export const signupWithPhoneTFAAction = createAction('SIGNUP_WITH_PHONE_TFA');

export const signupWithPhoneUsernameAction = createAction('SIGNUP_WITH_PHONE_USERNAME');

export const renderCaptchaInSignupAction = createAction('RENDER_CAPTCHA_IN_SIGNUP');

export const verifyCaptchaInSignupAction = createAction('VERIFY_CAPTCHA_IN_SIGNUP');

// Login action creators

export const loginWithPhoneAction = createAction('LOGIN_WITH_PHONE');
