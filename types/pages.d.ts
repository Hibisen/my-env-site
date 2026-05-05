export interface PagesFunction {
  (context: {
    request: Request;
    env: Record<string, any>;
    params: Record<string, string | string[]>;
  }): Promise<Response> | Response;
}
