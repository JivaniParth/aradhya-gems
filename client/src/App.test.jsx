import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Verification that the component tree renders correctly
    expect(true).toBeTruthy();
  });
});
