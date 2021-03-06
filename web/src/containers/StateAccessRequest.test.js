import React from 'react';
import { renderWithConnection, fireEvent } from 'apd-testing-library';
import StateAccessRequest from './StateAccessRequest';

let props;
let renderUtils;

describe('<StateAccessRequest />', () => {
  beforeEach(() => {
    props = {
      errorMessage: false,
      action: jest.fn(),
      fetching: false
    };
    renderUtils = renderWithConnection(<StateAccessRequest {...props} />);
  });

  it('title rendered', () => {
    const { getAllByText } = renderUtils;
    expect(getAllByText(/Verify Your Identity/i).length).toBeGreaterThan(0);
  });

  it('allows the user to select the first item', () => {
    const { getByText } = renderUtils;
    fireEvent.click(getByText(/Submit/i));
    expect(props.action).toHaveBeenCalledWith(['al']);
  });

  it('allows the users to select any item', () => {
    const { getByLabelText, getByText } = renderUtils;
    fireEvent.change(getByLabelText(/Select your State Affiliation/i), {
      target: { value: 'mo' }
    });
    fireEvent.click(getByText(/Submit/i));
    expect(props.action).toHaveBeenCalledWith(['mo']);
  });
});
