import React from 'react';
import { render, screen } from '../../../tests/testUtils';
import '@testing-library/jest-dom/extend-expect';
import Fire from '../../../services/Firebase';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';

import Login from './Login';

test('should render login page with header', async () => {
  render(<Login />, { route: '/login' }, false);
  expect(await screen.findByText('עמוד כניסה'));
});

test('should type in email input', async () => {  
  render(<Login />, { route: '/login' }, false);

  const emailInput = await screen.findByTestId('email-input');
  fireEvent.change(emailInput, { target: { detail: { value: 'rimon@mail.com' } } });
  expect((emailInput as any).detail.value).toBe('rimon@mail.com');
});

test('should type in password input', async () => {  
  render(<Login />, { route: '/login' }, false);

  const passwordInput = await screen.findByTestId('password-input');
  fireEvent.change(passwordInput, { target: { detail: { value: 'testpassword' } } });
  expect((passwordInput as any).detail.value).toBe('testpassword');
});

test('should call Fire.doSignIn on login btn click', async () => {
  const mockDoSignIn = jest.spyOn(Fire, 'doSignIn');
  render(<Login />, { route: '/login' }, false);

  const emailInput = await screen.findByTestId('email-input');
  fireEvent.ionChange(emailInput, 'rimon@mail.com');

  const passwordInput = await screen.findByTestId('password-input');
  fireEvent.ionChange(passwordInput, 'testpassword');

  fireEvent.click(await screen.findByTestId('login-button'));

  expect(mockDoSignIn).toHaveBeenCalledTimes(1);
  expect(mockDoSignIn).toHaveBeenCalledWith('rimon@mail.com', 'testpassword');
});
