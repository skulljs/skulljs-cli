/**
 * Props needed to generate managers files
 */
export interface ManagerProps {
  app_name: string;
  script_path: string;
  port: number;
  dockerfile_opt_runs: string[];
}

export interface BuildProps {
  apiPrefix?: string;
  port: number;
  hostname: string;
  protocol: string;
}
