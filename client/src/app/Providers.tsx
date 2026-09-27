"use client";

import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { SettingsProvider } from '../context/SettingsContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SettingsProvider>
        {children}
      </SettingsProvider>
    </Provider>
  );
}
