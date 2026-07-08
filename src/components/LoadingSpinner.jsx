import React from 'react';
// SECTION: Loading spinner
const LoadingSpinner = ({ label = 'Generating narrative' }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 text-slate-300">
      <div className="h-6 w-6 border-2 border-studio-border border-t-studio-primary rounded-full animate-spin" aria-hidden="true" />
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
    </div>
  );
};
export default LoadingSpinner;