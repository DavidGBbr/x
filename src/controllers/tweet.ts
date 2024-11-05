import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addTweetSchema } from "../schemas/add-tweet";
import {
  createTweet,
  findAnswersFromTweet,
  findTweet,
} from "../services/tweet";
import { addHashtag } from "../services/trend";

export const addTweet = async (req: ExtendedRequest, res: Response) => {
  const safeData = addTweetSchema.safeParse(req.body);
  if (!safeData.success) {
    res.status(400).json({ error: safeData.error.flatten().fieldErrors });
    return;
  }

  if (safeData.data.answer) {
    const hasAnswerTweet = await findTweet(parseInt(safeData.data.answer));
    if (!hasAnswerTweet) {
      res.status(404).json({ error: "Tweet de resposta não encontrado" });
      return;
    }
  }

  const newTweet = await createTweet(
    req.userSlug as string,
    safeData.data.body,
    safeData.data.answer ? parseInt(safeData.data.answer) : 0
  );

  const hashtags = safeData.data.body.match(/#[a-zA-Z0-9_]+/g);
  if (hashtags) {
    for (const hashtag of hashtags) {
      await addHashtag(hashtag);
    }
  }

  res.status(201).json({ tweet: newTweet });
};

export const getTweet = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;

  const tweet = await findTweet(parseInt(id));
  if (!tweet) {
    res.status(404).json({ error: "Tweet não encontrado" });
    return;
  }

  res.json({ tweet });
};

export const getAnswers = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;

  const answers = await findAnswersFromTweet(parseInt(id));

  res.json({ answers });
};
