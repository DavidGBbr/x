import { RequestHandler } from "express";
import { signupSchema } from "../schemas/signup";
import { findUserByEmail, findUserBySlug } from "../services/user";
import slug from "slug";

export const signup: RequestHandler = async (req, res) => {
  const safeData = signupSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }

  const hasEmail = await findUserByEmail(safeData.data.email);
  if (hasEmail) {
    res.json({ error: "E-mail já existe" });
    return;
  }

  let genSlug = true;
  let userSlug = slug(safeData.data.name);
  while (genSlug) {
    const hasSlug = await findUserBySlug(userSlug);
    if (hasSlug) {
      let slugSuffix = Math.floor(Math.random() * 999999).toString();
      userSlug = slug(safeData.data.name + slugSuffix);
    } else {
      genSlug = false;
    }
  }

  res.json({});
};
