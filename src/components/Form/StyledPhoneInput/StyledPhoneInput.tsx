import React from 'react';
import PhoneInputWithCountry from 'react-phone-number-input';
import {E164Number} from 'libphonenumber-js/core';
import './_styledPhoneInput.scss';

interface StyledPhoneInputProps {
  phone: E164Number | undefined; // Ensure this matches the expected phone type
  setPhone(value?: E164Number): void; // Function to update the phone value
}

function StyledPhoneInput({ phone, setPhone }: StyledPhoneInputProps) {
  return (
    <PhoneInputWithCountry
      value={phone}
      onChange={(val) => {
        // Check if val is not undefined
        if (val) {
          // Set the value as E164Number directly
          setPhone(val as E164Number);
        } else {
          setPhone(undefined); // Clear the phone value
        }
      }}
      placeholder='Enter phone number'
      limitMaxLength={true}
      smartCaret={false}
    />
  );
}

export default StyledPhoneInput;
