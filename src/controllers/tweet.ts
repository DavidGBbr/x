import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addTweetSchema } from "../schemas/add-tweet";
import { createTweet, findTweet } from "../services/tweet";

export const addTweet = async (req: ExtendedRequest, res: Response) => {
  const safeData = addTweetSchema.safeParse(req.body);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }

  if (safeData.data.asnwer) {
    const hasAnswerTweet = await findTweet(parseInt(safeData.data.asnwer));
    if (!hasAnswerTweet) {
      res.json({ error: "Tweet de resposta não encontrado" });
      return;
    }
  }

  const newTweet = await createTweet(
    req.userSlug as string,
    safeData.data.body,
    safeData.data.asnwer ? parseInt(safeData.data.asnwer) : 0
  );

  res.json({ tweet: newTweet });
};
