import React from 'react';
import { render, screen } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';
import Fire from '../../../services/Firebase';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';

import Registration from './Registration';

describe('Registration Page', () => {
  test('should render registration page with header', async () => {
    render(<Registration />, { route: '/registration' }, false);
    expect(await screen.findByText('עמוד הרשמה'));
  });

  test('should type in user name input', async () => {  
    render(<Registration />, { route: '/registration' }, false);
    const userNameInput = await screen.findByTestId('userName-registration-input');
    fireEvent.change(userNameInput, { target: { detail: { value: 'elad rimon' } } });
    expect((userNameInput as any).detail.value).toBe('elad rimon');
  });

  test('should type in email input', async () => {  
    render(<Registration />, { route: '/registration' }, false);
    const emailInput = await screen.findByTestId('email-registration-input');
    fireEvent.change(emailInput, { target: { detail: { value: 'rimon@mail.com' } } });
    expect((emailInput as any).detail.value).toBe('rimon@mail.com');
  });

  test('should type in password input', async () => {  
    render(<Registration />, { route: '/registration' }, false);
    const passwordInput = await screen.findByTestId('password-registration-input');
    fireEvent.change(passwordInput, { target: { detail: { value: 'testpassword' } } });
    expect((passwordInput as any).detail.value).toBe('testpassword');
  });

  test('should select user location', async () => {  
    render(<Registration />, { route: '/registration' }, false);
    const locationInput = await screen.findByTestId('location-registration-input');
    fireEvent.change(locationInput, { target: { detail: { value: 'TA' } } });
    expect((locationInput as any).detail.value).toBe('TA');
  });

  test('should call Fire.doEmailRegistration on registration btn click', async () => {
    const mockDoRegistration = jest.spyOn(Fire, 'doEmailRegistration');
    render(<Registration />, { route: '/registration' }, false);

    const userNameInput = await screen.findByTestId('userName-registration-input');
    fireEvent.ionChange(userNameInput, 'elad rimon');
    
    const emailInput = await screen.findByTestId('email-registration-input');
    fireEvent.ionChange(emailInput, 'rimon@mail.com');
    
    const passwordInput = await screen.findByTestId('password-registration-input');
    fireEvent.ionChange(passwordInput, 'testpassword');

    const locationInput = await screen.findByTestId('location-registration-input');
    fireEvent.ionChange(locationInput, 'TA');
    
    fireEvent.click(await screen.findByTestId('registration-button'));
    
    expect(mockDoRegistration).toHaveBeenCalledTimes(1);
    expect(mockDoRegistration).toHaveBeenCalledWith('elad rimon', 'TA', 'rimon@mail.com', 'testpassword');
});
});
