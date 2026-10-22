import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, appUrl } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-semibold">
          <span className="grid size-6 place-items-center rounded-md bg-fd-primary text-xs font-bold text-fd-primary-foreground">
            O
          </span>
          {appName}
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
