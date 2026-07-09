import { createContext, useContext } from 'react';

/**
 * Controls whether the contextual "Help Agent" button renders on blocker
 * screens. Toggled from the configurator's Developer Settings so the button
 * can be shown or hidden across the whole prototype.
 */
export const HelpAgentButtonContext = createContext(true);

export const useHelpAgentButtonVisible = () => useContext(HelpAgentButtonContext);
