// Import testing utilities
import { render, screen } from '@testing-library/react';
import App from './App';

// Test case to check if the "learn react" link is rendered
test('renders learn react link', () => {
  // render App 
  render(<App />);
  
  // Get element with text matching "learn react"
  const linkElement = screen.getByText(/learn react/i);
  
  // Expect the element to be in the document
  expect(linkElement).toBeInTheDocument();
});
