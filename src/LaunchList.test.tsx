import React from 'react';
import { render } from '@testing-library/react';
import LaunchList from './LaunchList';

test('renders upcoming launches', () => {
  const { getByText } = render(<LaunchList/>);
  const titleElement = getByText("Upcoming Launches");
  expect(titleElement).toBeInTheDocument();
});

test('renders sort by dropdown', () => {
  const { getByTestId } = render(<LaunchList/>);
  const dropdownElement = getByTestId("sortOrder");
  expect(dropdownElement).toBeInTheDocument();
});

test('renders search input', () => {
  const { getByTestId } = render(<LaunchList/>);
  const inputElement = getByTestId("textSearch");
  expect(inputElement).toBeInTheDocument();
});
