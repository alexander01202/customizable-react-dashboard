// src/components/RegulatorFilter.js
import React from 'react';
import { REGULATOR_OPTIONS } from '../constants/regulatorOptions';

export const RegulatorFilter = ({ style, onSelect }) => {
  return (
    <select 
      name="regulators" 
      style={style} 
      onChange={(e) => onSelect(e.target.value)}
    >
      {REGULATOR_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
