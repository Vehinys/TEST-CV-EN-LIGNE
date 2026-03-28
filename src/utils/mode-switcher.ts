export type PortfolioMode = 'os' | 'classic';

export function toggleMode(): void {
  const html = document.documentElement;
  const current = html.getAttribute('data-portfolio-mode') as PortfolioMode;
  const next: PortfolioMode = current === 'os' ? 'classic' : 'os';
  html.setAttribute('data-portfolio-mode', next);
  localStorage.setItem('portfolio-mode', next);
}

export function getCurrentMode(): PortfolioMode {
  return (document.documentElement.getAttribute('data-portfolio-mode') as PortfolioMode) ?? 'os';
}
