import { createContext, useContext, useState } from 'react';

// Export context that sets auth in session storage after login
// Stores data? Add refresh button to updates page?

const DataContext = createContext({ projects: [], updates: [], auth: null });
