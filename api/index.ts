import app from "../serve.ts";

export default function handler(req: any, res: any) {
  return app(req, res);
}
