import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import {
  findUserBySlug,
  getUserFollowersCount,
  getUserFollowingCount,
  getUserTweetCount,
} from "../services/user";

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
