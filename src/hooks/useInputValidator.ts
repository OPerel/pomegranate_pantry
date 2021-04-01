import { useState, useEffect } from 'react';

type ValidatorRules = 
  'kgUnitType' |
  'unitUnitType' |
  'email' |
  'password' |
  'required';

const messages = {
  'kgUnitType': 'הכנס כמות בכפולות של 0.5',
  'unitUnitType': 'הכנס כמות בכפולות של 1',
  'email': 'הכנס כתובת אי-מייל תקינה',
  'password': 'אורך הסיסמה צריך להיות 8 תוים לפחות',
  'required': 'שדה חובה'
}

interface ValidatorRes {
  valid: boolean;
  message: string | null
}

const initialState: ValidatorRes = {
  valid: false,
  message: null
}

const useInputValidator = (
  value: number | string,
  rule: ValidatorRules
): ValidatorRes => {
  const [res, setRes] = useState<ValidatorRes>(initialState);

  useEffect(() => {
    if (value) {
      let valid: boolean = true, message: string | null = null;

        switch (rule) {
          case 'kgUnitType': {
            valid = value > 0 && Number(value) % 0.5 === 0;
            message = valid ? null : messages['kgUnitType'];
            break;
          }
          case 'unitUnitType': {
            valid = value > 0 && Number(value) % 1 === 0;
            message = valid ? null : messages['unitUnitType'];
            break;
          }
          case 'email': {
            const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            valid = regexp.test(String(value).toLowerCase());
            message = valid ? null : messages['email'];
            break;
          }
          case 'password': {
            valid = String(value).length > 7;
            message = valid ? null : messages['password'];
            break;
          }
          case 'required': {
            valid = String(value).length > 0;
            message = valid ? null : messages['required'];
            break;
          }
          default: {
            valid = false;
            message = null;
          }
        }
        
      setRes({ valid, message });

    } else {
      setRes(initialState);
    }
  }, [value, rule]);

  return res;
}

export default useInputValidator;