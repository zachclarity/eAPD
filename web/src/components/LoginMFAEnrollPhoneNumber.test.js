import React from 'react';
import { renderWithConnection, fireEvent } from 'apd-testing-library';
import LoginMFAEnrollPhoneNumber from './LoginMFAEnrollPhoneNumber';

let props;
let renderUtils;

describe('<LoginMFAEnrollPhoneNumber />', () => {
  beforeEach(() => {
    props = {
      handlePhoneSubmit: jest.fn()
    };
    renderUtils = renderWithConnection(
      <LoginMFAEnrollPhoneNumber {...props} />
    );
  });

  test('title renders', () => {
    const { getByText } = renderUtils;
    expect(getByText(/Verify Your Identity/)).toBeTruthy();
  });

  test('phone field renders', () => {
    const { getByTestId } = renderUtils;
    expect(getByTestId('mfaPhoneNumber')).toBeTruthy();
  });

  test('user enters phone number', () => {
    const { getByTestId, getByRole } = renderUtils;
    fireEvent.change(getByTestId('mfaPhoneNumber'), {
      target: { value: '4105555555' }
    });
    fireEvent.click(getByRole('button', { name: 'Submit' }));
    expect(props.handlePhoneSubmit).toHaveBeenCalledWith('4105555555');
  });
});
