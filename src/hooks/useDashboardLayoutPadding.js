import { useLocation } from 'react-router-dom';

/**
 * Public pages reserve space for fixed navbar; dashboard uses compact top inset.
 */
export function useMarketingPageTopPadding() {
  const path = useLocation().pathname;
  return path.startsWith('/dashboard') ? 2 : { xs: 12, md: 14 };
}

export function useChatPageTopPadding() {
  const path = useLocation().pathname;
  return path.startsWith('/dashboard')
    ? { xs: 2, md: 2.5 }
    : { xs: 9, md: 10 };
}
