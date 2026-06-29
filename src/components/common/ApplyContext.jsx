import { createContext, useContext, useState, useCallback } from 'react';
import ApplyModal from './ApplyModal';

const ApplyCtx = createContext(() => {});
export const useApply = () => useContext(ApplyCtx);

// App-level provider: renders the apply popup once and lets any component
// open it via useApply().
export function ApplyProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [formProps, setFormProps] = useState({});
  // openApply() with no args (or called as an event handler) opens the default
  // form; openApply({ showProgram, backgroundOptions, ... }) customizes it.
  const openApply = useCallback((arg) => {
    const isEvent = arg && (arg.nativeEvent || arg.target || typeof arg.preventDefault === 'function');
    setFormProps(!arg || isEvent ? {} : arg);
    setOpen(true);
  }, []);
  return (
    <ApplyCtx.Provider value={openApply}>
      {children}
      <ApplyModal open={open} onClose={() => setOpen(false)} formProps={formProps} />
    </ApplyCtx.Provider>
  );
}
