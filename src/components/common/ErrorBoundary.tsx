import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[DARK MATTER COCKPIT FAULT]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] h-full p-8 bg-slate-950/90 border border-red-500/40 rounded-xl text-center shadow-[0_0_40px_rgba(239,68,68,0.2)]">
          <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-500/60 flex items-center justify-center text-red-400 mb-4 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            <AlertOctagon className="w-8 h-8 animate-pulse" />
          </div>

          <h2 className="text-lg font-bold font-mono text-red-300 tracking-wider uppercase">
            TELEMETRY SUBSYSTEM ANOMALY DETECTED
          </h2>

          <p className="max-w-md text-xs text-slate-300 font-sans mt-2 leading-relaxed">
            The command module encountered an unexpected runtime fault. Spacecraft core memory remains protected by local storage redundancy.
          </p>

          {this.state.error && (
            <div className="mt-4 p-3 max-w-lg w-full rounded border border-red-900/60 bg-black/60 font-mono text-left text-[11px] text-red-400 overflow-x-auto">
              <span className="text-red-500 font-bold block mb-1">FAULT TRACE:</span>
              {this.state.error.message}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-lg border border-red-500/80 bg-red-950/60 hover:bg-red-900/60 text-red-200 text-xs font-mono font-semibold tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RE-ENGAGE MODULE SUBSYSTEM</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
