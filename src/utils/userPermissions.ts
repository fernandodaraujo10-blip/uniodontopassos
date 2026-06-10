export type AppPageId = 'dashboard' | 'relatorios' | 'envio' | 'configuracoes';

export const APP_PAGE_IDS: AppPageId[] = ['dashboard', 'relatorios', 'envio', 'configuracoes'];

export const normalizePageId = (page: string): AppPageId | null => {
  if (page.startsWith('envio')) return 'envio';
  if (page === 'dashboard' || page === 'relatorios' || page === 'configuracoes') return page;
  return null;
};

export const getDefaultAllowedPagesByRole = (role: string): AppPageId[] => {
  if (role === 'Diretor') {
    return ['dashboard', 'relatorios', 'configuracoes'];
  }

  return [...APP_PAGE_IDS];
};

export const normalizeAllowedPages = (role: string, allowedPages?: string[]): AppPageId[] => {
  const defaults = getDefaultAllowedPagesByRole(role);
  const validPages = (allowedPages || [])
    .filter((page): page is AppPageId => APP_PAGE_IDS.includes(page as AppPageId))
    .filter((page, index, arr) => arr.indexOf(page) === index);

  if (role === 'Diretor') {
    return validPages.filter((page) => page !== 'envio');
  }

  return validPages.length > 0 ? validPages : defaults;
};

export const hasPageAccess = (allowedPages: string[] | undefined, role: string, page: string): boolean => {
  const normalizedPage = normalizePageId(page);
  if (!normalizedPage) return true;

  const normalizedAllowedPages = normalizeAllowedPages(role, allowedPages);
  return normalizedAllowedPages.includes(normalizedPage);
};

export const isPageVisible = (allowedPages: string[] | undefined, role: string, page: string): boolean => {
  return hasPageAccess(allowedPages, role, page);
};
