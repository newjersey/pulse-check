import { render, screen } from '@testing-library/react';

import App from "../src/App";
import { defaultDataContext } from '../src/contexts/DataContext.tsx';

const mocks = vi.hoisted(() => {
  return {
    useDataContext: vi.fn(),
  }
})

vi.mock('../src/contexts/DataContext.tsx', async (importOriginal) => {
  const mod: object = await importOriginal()
  return {
    ...mod,
    ...mocks
  }
})

describe('App', () => {
  // it('renders login page', async () => {
  //   mocks.useDataContext.mockReturnValue(defaultDataContext)
  //   render(<App />);
  //   const h1 = screen.getByText(/Authenticate/i);
  //   expect(h1).toBeInTheDocument();
  // });

  it('renders logged in view', async () => {
    mocks.useDataContext.mockReturnValue({...defaultDataContext, authToken: 'foo'})
    render(<App />);
    const h1 = screen.getByText(/Project overview/i);
    expect(h1).toBeInTheDocument();
  });
});