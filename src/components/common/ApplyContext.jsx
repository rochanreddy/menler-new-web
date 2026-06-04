import { createContext, useContext, useState, useCallback } from 'react';
import ApplyModal from './ApplyModal';

const ApplyCtx = createContext(() => {});
export const useApply = () => useContext(ApplyCtx);

// App-level provider: renders the apply popup once and lets any component
// open it via useApply().
export function ApplyProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openApply = useCallback(() => setOpen(true), []);
  return (
    <ApplyCtx.Provider value={openApply}>
      {children}
      <ApplyModal open={open} onClose={() => setOpen(false)} />
    </ApplyCtx.Provider>
  );
}
