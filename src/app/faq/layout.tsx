import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Inflynce Boost',
  description: 'Frequently asked questions about Inflynce Protocol',
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
