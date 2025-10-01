import React from 'react';
import { Button } from './button';
import Loader from './Loader';

type Props = React.ComponentProps<typeof Button> & {
  loading?: boolean;
  loadingText?: string;
};

export default function ButtonWithLoader({ loading = false, loadingText = '', children, className = '', ...props }: Props) {
  const disabled = !!loading || !!(props as any).disabled;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Button {...(props as any)} className={`${className} flex items-center justify-center`} disabled={disabled}>
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader size="small" />
          {loadingText ? <span>{loadingText}</span> : null}
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
