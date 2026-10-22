import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  /** Optional label shown in the fallback UI, e.g. "Portfolio section". */
  label?: string;
  /** Render a compact inline fallback instead of a full card. */
  compact?: boolean;
}

interface State {
  error: Error | null;
}

/**
 * Catches render-time errors so one broken section (or the CMS modal)
 * never blanks out the whole page.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.label ? `: ${this.props.label}` : ''}]`, error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const { label, compact } = this.props;

    if (compact) {
      return (
        <div className="w-full px-4 py-10 flex flex-col items-center justify-center gap-3 text-center">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          <p className="text-xs text-neutral-500 font-mono">
            {label ? `${label} failed to render` : 'Failed to render'}
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-400 text-xs font-medium cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-5 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-amber-500" />
        </div>
        <div className="space-y-1.5 max-w-md">
          <h2 className="text-lg font-bold text-neutral-900">
            {label ? `${label} couldn't be loaded` : 'Something went wrong'}
          </h2>
          <p className="text-sm text-neutral-500 font-light">
            The rest of the page still works. You can retry this section or reload the page.
          </p>
          {import.meta.env.DEV && (
            <pre className="mt-3 max-h-32 overflow-auto text-left text-[11px] font-mono text-rose-600 bg-rose-500/5 border border-rose-500/20 rounded-lg p-3 whitespace-pre-wrap">
              {error.message}
            </pre>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold cursor-pointer transition-all hover:brightness-110 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 cursor-pointer transition-all hover:border-neutral-400 active:scale-95"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
