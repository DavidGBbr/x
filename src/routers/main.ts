import { Router } from "express";
import * as pingController from "../controllers/ping";
import * as AuthController from "../controllers/auth";
import * as TweetController from "../controllers/tweet";
import { verifyJWT } from "../utils/jwt";

export const mainRouter = Router();

mainRouter.get("/ping", pingController.ping);
mainRouter.get("/privateping", verifyJWT, pingController.privatePing);

mainRouter.post("/auth/signup", AuthController.signup);
mainRouter.post("/auth/signin", AuthController.signin);

mainRouter.post("/tweet", verifyJWT, TweetController.addTweet);
mainRouter.get("/tweet/:id", verifyJWT, TweetController.getTweet);
mainRouter.get("/tweet/:id/answers", verifyJWT, TweetController.getAnswers);
// mainRouter.post("/tweet/:id/like");

// mainRouter.get("/user/:slug");
// mainRouter.get("/user/:slug/tweets");
// mainRouter.post("/user/:slug/follow");
// mainRouter.put("/user");
// mainRouter.put("/user/avatar");
// mainRouter.put("/user/cover");

// mainRouter.get("/feed");
// mainRouter.get("/search");
// mainRouter.get("/trending");
// mainRouter.get("/suggestions");
