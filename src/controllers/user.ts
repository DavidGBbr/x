import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import {
  findUserBySlug,
  getUserFollowersCount,
  getUserFollowingCount,
  getUserTweetCount,
} from "../services/user";
import { userTweetsSchema } from "../schemas/user-tweets";
import { findTweetsByUser } from "../services/tweet";

export const getUser = async (req: ExtendedRequest, res: Response) => {
  const { slug } = req.params;

  const user = await findUserBySlug(slug);
  if (!user) {
    res.json({ error: "Usuário inexistente" });
    return;
  }

  const followingCount = await getUserFollowingCount(user.slug);
  const followersCount = await getUserFollowersCount(user.slug);
  const tweetCount = await getUserTweetCount(user.slug);

  res.json({ user, followingCount, followersCount, tweetCount });
};

export const getUserTweets = async (req: ExtendedRequest, res: Response) => {
  const { slug } = req.params;

  const safeData = userTweetsSchema.safeParse(req.query);
  if (!safeData.success) {
    res.json({ error: safeData.error.flatten().fieldErrors });
    return;
  }

  let perPage = 10;
  let currentPage = safeData.data.page ?? 0;

  const tweets = await findTweetsByUser(slug, currentPage, perPage);

  res.json({ tweets, page: currentPage });
};
