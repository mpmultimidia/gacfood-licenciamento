import app from "../serve";

export default function handler(req: any, res: any) {
  return app(req, res);
}
