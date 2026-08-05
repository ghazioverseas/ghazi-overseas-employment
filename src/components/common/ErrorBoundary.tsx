"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
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
    console.error("[ERROR_BOUNDARY_CAPTURED]", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">An unexpected system error occurred</h2>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            {this.state.error?.message || "Please refresh the page or contact Ghazi support if the issue persists."}
          </p>
          <Button
            onClick={() => this.setState({ hasError: false })}
            className="mt-6 bg-slate-900 hover:bg-slate-800"
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
