/**
 * Props needed to create a new slulljs project
 */
export interface NewProps {
  name: string;
  backend_path: string | null;
  backend_repository: string | null;
  backend_cli?: string;
  backend_version: string | null;
  frontend_path: string | null;
  frontend_repository: string | null;
  frontend_cli?: string;
  frontend_version: string | null;
  bname?: string | null;
  fname?: string | null;
  sk_version: string;
}
