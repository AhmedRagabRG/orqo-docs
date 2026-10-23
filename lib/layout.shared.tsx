import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { OrqoLogo } from '@/components/orqo-logo';
import { appName, appUrl } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2" aria-label={appName}>
          <OrqoLogo className="h-6" />
          <span className="rounded-md border px-1.5 py-0.5 text-xs font-medium text-fd-muted-foreground">API</span>
        </span>
      ),
    },
    links: [
      { text: 'Documentation', url: '/docs', active: 'url' },
      { text: 'API reference', url: '/docs/api', active: 'nested-url' },
      { text: 'Open ORQO', url: appUrl, external: true },
    ],
  };
}
