import auth, { selectIsLoggedIn } from './auth';

import {
  AUTH_CHECK_SUCCESS,
  AUTH_CHECK_FAILURE,
  LOGIN_REQUEST,
  LOGIN_OTP_STAGE,
  LOGIN_MFA_REQUEST,
  LOGIN_MFA_ENROLL_START,
  LOGIN_MFA_ENROLL_ADD_PHONE,
  LOGIN_MFA_ENROLL_ACTIVATE,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_MFA_FAILURE,
  LOGOUT_SUCCESS,
  LOCKED_OUT,
  RESET_LOCKED_OUT
} from '../actions/auth';

describe('auth reducer', () => {
  const initialState = {
    authenticated: false,
    error: '',
    fetching: false,
    hasEverLoggedOn: false,
    otpStage: false,
    initialCheck: false,
    factorsList: '',
    mfaEnrollStartStage: false,
    mfaEnrollAddPhoneStage: false,
    mfaEnrollActivateStage: false,
    mfaPhoneNumber: '',
    user: null,
    verifyData: null,
    requestAccess: false,
    requestAccessSuccess: false,
    selectState: false,
    mfaEnrollType: '',
    isLocked: false
  };

  it('should handle initial state', () => {
    expect(auth(undefined, {})).toEqual(initialState);
  });

  it('should handle AUTH_CHECK_SUCCESS', () => {
    expect(
      auth(initialState, { type: AUTH_CHECK_SUCCESS, data: 'user info' })
    ).toEqual({
      ...initialState,
      otpStage: false,
      authenticated: true,
      hasEverLoggedOn: true,
      initialCheck: true,
      user: 'user info'
    });
  });

  it('should handle AUTH_CHECK_FAILURE', () => {
    expect(auth(initialState, { type: AUTH_CHECK_FAILURE })).toEqual({
      ...initialState,
      initialCheck: true,
      otpStage: false,
      authenticated: false
    });
  });

  it('should handle LOGIN_REQUEST', () => {
    expect(auth(initialState, { type: LOGIN_REQUEST })).toEqual({
      ...initialState,
      fetching: true,
      otpStage: false,
      authenticated: false,
      error: ''
    });
  });

  it('should handle LOGIN_OTP_STAGE', () => {
    expect(auth(initialState, { type: LOGIN_OTP_STAGE })).toEqual({
      ...initialState,
      fetching: false,
      otpStage: true,
      authenticated: false,
      error: ''
    });
  });

  it('should handle LOGIN_MFA_REQUEST', () => {
    expect(auth(initialState, { type: LOGIN_MFA_REQUEST })).toEqual({
      ...initialState,
      fetching: true,
      otpStage: true,
      authenticated: false,
      error: ''
    });
  });

  it('should handle LOGIN_SUCCESS', () => {
    expect(
      auth(initialState, { type: LOGIN_SUCCESS, data: 'user goes here' })
    ).toEqual({
      ...initialState,
      otpStage: false,
      authenticated: true,
      fetching: false,
      hasEverLoggedOn: true,
      user: 'user goes here'
    });
  });

  it('should handle LOGIN_FAILURE', () => {
    expect(auth(initialState, { type: LOGIN_FAILURE, error: 'foo' })).toEqual({
      ...initialState,
      otpStage: false,
      fetching: false,
      error: 'foo'
    });
  });

  it('should handle LOGIN_MFA_FAILURE', () => {
    expect(
      auth(initialState, { type: LOGIN_MFA_FAILURE, error: 'foo' })
    ).toEqual({
      ...initialState,
      fetching: false,
      error: 'foo'
    });
  });

  it('should handle LOGIN_MFA_ENROLL_START', () => {
    expect(
      auth(initialState, {
        type: LOGIN_MFA_ENROLL_START,
        data: { phoneNumber: '4108675309', factors: [{}] }
      })
    ).toEqual({
      ...initialState,
      fetching: false,
      mfaEnrollStartStage: true,
      factorsList: [{}],
      mfaPhoneNumber: '4108675309'
    });
  });

  it('should handle LOGIN_MFA_ENROLL_ADD_PHONE', () => {
    expect(
      auth(initialState, { type: LOGIN_MFA_ENROLL_ADD_PHONE, data: 'Call' })
    ).toEqual({
      ...initialState,
      fetching: false,
      mfaEnrollStartStage: false,
      mfaEnrollAddPhoneStage: true,
      mfaEnrollType: 'Call'
    });
  });

  it('should handle LOGIN_MFA_ENROLL_ACTIVATE', () => {
    expect(
      auth(initialState, {
        type: LOGIN_MFA_ENROLL_ACTIVATE,
        data: { mfaEnrollType: 'Call', activationData: '' }
      })
    ).toEqual({
      ...initialState,
      fetching: false,
      mfaEnrollStartStage: false,
      mfaEnrollAddPhoneStage: false,
      mfaEnrollActivateStage: true,
      mfaEnrollType: 'Call',
      verifyData: ''
    });
  });

  it('should handle LOCKED_OUT', () => {
    expect(auth(initialState, { type: LOCKED_OUT })).toEqual({
      ...initialState,
      isLocked: true
    });
  });

  it('should handle RESET_LOCKED_OUT', () => {
    expect(auth(initialState, { type: RESET_LOCKED_OUT })).toEqual({
      ...initialState,
      isLocked: false
    });
  });

  it('should handle LOGOUT_SUCCESS', () => {
    expect(auth(initialState, { type: LOGOUT_SUCCESS })).toEqual({
      ...initialState,
      otpStage: false,
      hasEverLoggedOn: false,
      initialCheck: false
    });
  });

  describe('when user is already logged in', () => {
    it('should reset auth after LOGOUT_SUCCESS', () => {
      const state = {
        authenticated: true,
        initialCheck: true,
        hasEverLoggedOn: true
      };

      expect(auth(state, { type: LOGOUT_SUCCESS })).toEqual({
        ...initialState,
        authenticated: false,
        error: '',
        fetching: false,
        hasEverLoggedOn: true,
        initialCheck: true,
        otpStage: false,
        isLocked: false,
        user: null,
        requestAccess: false,
        requestAccessSuccess: false,
        selectState: false,
        factorsList: '',
        mfaEnrollActivateStage: false,
        mfaEnrollAddPhoneStage: false,
        mfaEnrollStartStage: false,
        mfaEnrollType: '',
        mfaPhoneNumber: '',
        verifyData: null
      });
    });
  });

  it('selects the current logged-in state', () => {
    expect(
      selectIsLoggedIn({
        auth: { authenticated: 'this is the authenticated state value' }
      })
    ).toEqual('this is the authenticated state value');
  });
});
