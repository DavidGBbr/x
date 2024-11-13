import { Router } from "express";
import * as pingController from "../controllers/ping";
import * as AuthController from "../controllers/auth";
import * as TweetController from "../controllers/tweet";
import * as UserController from "../controllers/user";
import * as FeedController from "../controllers/feed";
import * as TrendController from "../controllers/trend";
import * as SearchController from "../controllers/search";
import { verifyJWT } from "../utils/jwt";

export const mainRouter = Router();

mainRouter.get("/ping", pingController.ping);
mainRouter.get("/privateping", verifyJWT, pingController.privatePing);

mainRouter.post("/auth/signup", AuthController.signup);
mainRouter.post("/auth/signin", AuthController.signin);

mainRouter.post("/tweet", verifyJWT, TweetController.addTweet);
mainRouter.get("/tweet/:id", verifyJWT, TweetController.getTweet);
mainRouter.get("/tweet/:id/answers", verifyJWT, TweetController.getAnswers);
mainRouter.post("/tweet/:id/like", verifyJWT, TweetController.likeToggle);

mainRouter.get("/user/:slug", verifyJWT, UserController.getUser);
mainRouter.get("/user/:slug/tweets", verifyJWT, UserController.getUserTweets);
mainRouter.post("/user/:slug/follow", verifyJWT, UserController.followToggle);
mainRouter.put("/user", verifyJWT, UserController.updateUser);
// mainRouter.put("/user/avatar");
// mainRouter.put("/user/cover");

mainRouter.get("/feed", verifyJWT, FeedController.getFeed);
mainRouter.get("/search", verifyJWT, SearchController.searchTweets);
mainRouter.get("/trending", verifyJWT, TrendController.getTrends);
// mainRouter.get("/suggestions");
