// src/components/TypeFilter.js
import React from 'react';
import { TYPE_OPTIONS } from '../constants/typeOptions';

const TypeFilter = ({ style, onSelect }) => {
  return (
    <select 
      name="types" 
      style={style} 
      onChange={(e) => onSelect(e.target.value)}
    >
      {TYPE_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default TypeFilter;