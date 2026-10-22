import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

// Dev-only helper for visual QA: allows ?y=<px> to jump to a scroll position
// and ?open=<selector> to open a modal. Stripped from production builds.
if (import.meta.env.DEV) {
  const params = new URLSearchParams(window.location.search);
  if (params.get('noreveal')) {
    document.documentElement.classList.add('no-reveal');
  }
  const y = params.get('y');
  if (y) {
    const target = Number(y);
    document.documentElement.style.scrollBehavior = 'auto';
    // Step through the page so every scroll-reveal fires, then settle on target.
    let attempts = 0;
    const tryScroll = () => {
      attempts += 1;
      if (document.documentElement.scrollHeight > target + window.innerHeight || attempts > 60) {
        const steps = 24;
        let i = 0;
        const step = () => {
          i += 1;
          const t = i / steps;
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          window.scrollTo({ top: target * eased, behavior: 'instant' as ScrollBehavior });
          if (i < steps) window.setTimeout(step, 55);
        };
        step();
      } else {
        window.setTimeout(tryScroll, 100);
      }
    };
    window.setTimeout(tryScroll, 100);
  }
  const open = params.get('open');
  if (open) {
    window.setTimeout(() => {
      document.querySelector<HTMLElement>(open)?.click();
    }, 400);
  }
}
