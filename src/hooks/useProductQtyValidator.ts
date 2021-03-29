import { useState, useEffect } from 'react';
import { UNIT_TYPE } from '../constants';

const messages = {
  [UNIT_TYPE.KG]: 'הכנס כמות בכפולות של 0.5',
  [UNIT_TYPE.UNIT]: 'הכנס כמות בכפולות של 1'
}

interface ValidatorRes {
  valid: boolean;
  message: string | null
}

const initialState: ValidatorRes = {
  valid: false,
  message: null
}

const useProductQtyValidator = (
  value: number,
  qtyUnit: 'Kg' | 'unit'
): ValidatorRes => {
  const [res, setRes] = useState<ValidatorRes>(initialState);

  useEffect(() => {
    if (value) {

      let valid = qtyUnit === UNIT_TYPE.KG ? value % 0.5 === 0 : value % 1 === 0;
      valid = valid && value > 0;
      const message = valid ? null : messages[qtyUnit]
      
      setRes({ valid, message });
    } else {
      setRes(initialState);
    }
  }, [value, qtyUnit]);

  return res;
}

export default useProductQtyValidator;