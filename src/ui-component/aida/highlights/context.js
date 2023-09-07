import { createContext, useContext } from 'react';

const HighlightsContext = createContext(null);
export const useHighlightsContext = () => useContext(HighlightsContext);

export * from './protocol-highlights-context-provider';
export * from './doc-highlights-context-provider';

export default HighlightsContext;
