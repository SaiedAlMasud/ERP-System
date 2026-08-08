import { Router } from "express";
import {login,getCurrentUser, logout} from "./auth.controller.js";
import authMiddleware from "../../shared/middleware/auth.middleware.js";

const router = Router();

router.post("/login", login);

router.get("/me",authMiddleware,getCurrentUser);

router.post("/logout", logout);

export default router;