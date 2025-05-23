import React from 'react';
import type { IconType } from 'react-icons'; 

interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  Icon?: IconType; 
  error?: string;
}

const StyledInput: React.FC<StyledInputProps> = ({ label, id, Icon, error, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text-secondary)] sr-only">
        {label}
      </label>
      <div className="mt-1 relative rounded-[var(--border-radius-default)] shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-[var(--color-text-muted)]" aria-hidden="true" />
          </div>
        )}
        <input
          id={id}
          name={id} 
          {...props}
          className={`appearance-none block w-full px-4 ${Icon ? 'pl-10' : 'px-4'} py-3 
                      border ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-[var(--color-bg-tertiary)] focus:ring-[var(--color-amd-red)] focus:border-[var(--color-amd-red)]'} 
                      rounded-[var(--border-radius-default)] placeholder-[var(--color-text-muted)] 
                      text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] 
                      focus:outline-none sm:text-sm transition-colors`}
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default StyledInput;