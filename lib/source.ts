import { llms, loader } from 'fumadocs-core/source';
import { docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { openapi } from './openapi';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// Guides are MDX in content/docs; the API reference is one virtual page per
// operation in openapi.json, grouped by tag under /docs/api.
export const source = loader(
  {
    docs: docs.toFumadocsSource(),
    openapi: await openapi.staticSource({
      baseDir: 'api',
      per: 'operation',
      groupBy: 'tag',
    }),
  },
  {
    baseUrl: docsRoute,
    plugins: [openapi.loaderPlugin()],
  },
);

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export const docsLlms = llms(source, {
  renderPage: async (page) => {
    if (page.type === 'openapi') {
      const { operations = [] } = page.data.getOpenAPIPageProps();
      const spec = page.data.getSchema().bundled as {
        paths?: Record<string, Partial<Record<HttpMethod, unknown>>>;
      };
      const blocks = operations.map(({ path, method }) => {
        const operation = spec.paths?.[path]?.[method as HttpMethod];

        return `## ${method.toUpperCase()} /api${path}\n\n\`\`\`json\n${JSON.stringify(operation, null, 2)}\n\`\`\``;
      });

      return `# ${page.data.title} (${page.url})\n\n${page.data.description ?? ''}\n\n${blocks.join('\n\n')}`;
    }

    return `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`;
  },
});
