import './globals.css';
import { QueryProvider } from '../providers/query-provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><QueryProvider>{children}</QueryProvider></body></html>;
}
