'use client';

import React from 'react';
import { usePathname } from 'next/navigation';                      // client-only hook  [oai_citation:1‡nextjs.org](https://nextjs.org/docs/app/api-reference/functions/use-pathname?utm_source=chatgpt.com)
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function Breadcrumbs() {
  const pathname = usePathname() || '/';                            // get current path  [oai_citation:2‡geeksforgeeks.org](https://www.geeksforgeeks.org/reactjs/how-to-create-dynamic-breadcrumbs-component-in-nextjs/?utm_source=chatgpt.com)
  const segments = pathname.split('/').filter(Boolean);             // split into ["course","[slug]",...]  [oai_citation:3‡gcasc.io](https://www.gcasc.io/blog/next-dynamic-breadcrumbs?utm_source=chatgpt.com)

  // build an array of { href, label } objects
  const crumbs = segments.map((seg, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/');  
    const label = seg
      .replace(/-/g, ' ')                                          // replace dashes  [oai_citation:4‡geeksforgeeks.org](https://www.geeksforgeeks.org/reactjs/how-to-create-dynamic-breadcrumbs-component-in-nextjs/?utm_source=chatgpt.com)
      .replace(/\b\w/g, (c) => c.toUpperCase());                  // capitalize  [oai_citation:5‡medium.com](https://medium.com/%40kcabading/creating-a-breadcrumb-component-in-a-next-js-app-router-a0ea24cdb91a?utm_source=chatgpt.com)
    return { href, label };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Smart Study Hub</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {crumbs.map((crumb, i) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbItem>
              <BreadcrumbLink href={crumb.href}>
                {crumb.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {i < crumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}