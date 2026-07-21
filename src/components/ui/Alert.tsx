import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import { ReactNode } from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  children?: ReactNode;
}

export function Alert({
  type,
  title,
  message,
  children,
}: AlertProps) {
  const typeConfig = {
    success: {
      bgColor: 'bg-green-900/30',
      borderColor: 'border-green-600/50',
      icon: <CheckCircle size={20} className="text-green-400" />,
      titleColor: 'text-green-300',
    },
    error: {
      bgColor: 'bg-red-900/30',
      borderColor: 'border-red-600/50',
      icon: <XCircle size={20} className="text-red-400" />,
      titleColor: 'text-red-300',
    },
    warning: {
      bgColor: 'bg-yellow-900/30',
      borderColor: 'border-yellow-600/50',
      icon: <AlertCircle size={20} className="text-yellow-400" />,
      titleColor: 'text-yellow-300',
    },
    info: {
      bgColor: 'bg-blue-900/30',
      borderColor: 'border-blue-600/50',
      icon: <Info size={20} className="text-blue-400" />,
      titleColor: 'text-blue-300',
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 flex gap-3`}
    >
      {config.icon}
      <div className="flex-1">
        <h3 className={`font-semibold ${config.titleColor}`}>{title}</h3>
        {message && <p className="text-sm text-gray-300 mt-1">{message}</p>}
        {children}
      </div>
    </div>
  );
}
