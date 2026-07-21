import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center w-full py-8">
      <Loader2 size={size} className="text-electric-500 animate-spin" />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-electric-500/20 border-t-electric-500 animate-spin" />
        <p className="text-dark-100 font-display text-lg">AB.TECHNILOGIE</p>
      </div>
    </div>
  );
}
