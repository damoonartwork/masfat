import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F6EFE4] text-[#132238] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#EADBCE] shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#F26A51]/10 text-[#F26A51] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black mb-2">خطایی در بارگذاری رخ داد</h2>
            <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
              متأسفانه مشکلی در پردازش اطلاعات رخ داده است. لطفاً صفحه را دوباره بارگذاری کنید.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="w-full py-3.5 bg-[#1FA3A3] hover:bg-[#198B8B] text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>بارگذاری دوباره</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
