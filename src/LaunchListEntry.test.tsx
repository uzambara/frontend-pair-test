import React from 'react';
import { render } from '@testing-library/react';
import LaunchListEntry from './LaunchListEntry';

const mockEntry = {
    id: 'hi'
}

test('renders the entry', () => {
  const { getByTestId } = render(<LaunchListEntry entry={mockEntry}/>);
  const titleElement = getByTestId("entryContainer");
  expect(titleElement).toBeInTheDocument();
});
