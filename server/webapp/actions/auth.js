// A set of action creators for user authentication

import { createAction } from 'redux-actions';

// Signup action creators

export const signupWithPhoneBasicInfoAction = createAction('SIGNUP_WITH_PHONE_BASIC_INFO');

export const signupWithPhoneTFAAction = createAction('SIGNUP_WITH_PHONE_TFA');

export const renderCaptchaInSignupAction = createAction('RENDER_CAPTCHA_IN_SIGNUP');

// Login action creators

export const loginWithPhoneAction = createAction('LOGIN_WITH_PHONE');

export const loadLoginStatusAction = createAction('LOAD_LOGIN_STATUS');

export const logoutAction = createAction('LOGOUT');