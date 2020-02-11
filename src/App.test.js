import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders North Station departure board', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText('North Station Commuter Rail Departures');
  expect(linkElement).toBeInTheDocument();
});

test('renders South Station departure board', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText('South Station Commuter Rail Departures');
  expect(linkElement).toBeInTheDocument();
});
