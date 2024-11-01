import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserBySlug } from "../services/user";
import { ExtendedRequest } from "../types/extended-request";

export const createJWT = (slug: string) => {
  return jwt.sign({ slug }, process.env.JWT_SECRET as string);
};

export const verifyJWT = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Acesso negado" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Acesso negado" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;
    const user = await findUserBySlug(decoded.slug);

    if (!user) {
      res.status(401).json({ error: "Acesso negado" });
      return;
    }

    req.userSlug = user.slug;
    next();
  } catch (error) {
    res.status(401).json({ error: "Acesso negado" });
  }
};
