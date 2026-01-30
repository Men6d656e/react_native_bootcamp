// // Arcjet middleware for rate limiting, bot protection, and security

// import type { NextFunction, Request, Response } from "express";
// import { aj } from "../lib/utils.js";

// export const arcjetMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const decision = await aj.protect(req, {
//       requested: 1, // each request consumes 1 token
//     });

//     // handle denied requests
//     if (decision.isDenied()) {
//       if (decision.reason.isRateLimit()) {
//         return res.status(429).json({
//           error: "Too Many Requests",
//           message: "Rate limit exceeded. Please try again later.",
//         });
//       } else if (decision.reason.isBot()) {
//         return res.status(403).json({
//           error: "Bot access denied",
//           message: "Automated requests are not allowed.",
//         });
//       } else {
//         return res.status(403).json({
//           error: "Forbidden",
//           message: "Access denied by security policy.",
//         });
//       }
//     }

//     // check for spoofed bots
//     if (
//       decision.results.some(
//         (result) => result.reason.isBot() && result.reason.isSpoofed(),
//       )
//     ) {
//       return res.status(403).json({
//         error: "Spoofed bot detected",
//         message: "Malicious bot activity detected.",
//       });
//     }

//     next();
//   } catch (error) {
//     console.error("Arcjet middleware error:", error);
//     // allow request to continue if Arcjet fails
//     next();
//   }
// };

import type { NextFunction, Request, Response } from "express";
import { aj } from "../lib/utils.js";

export const arcjetMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userAgent = req.headers["user-agent"] || "";
    // This identifies requests coming from Expo Go or your built React Native app
    const isMobileApp =
      userAgent.toLowerCase().includes("expo") ||
      userAgent.toLowerCase().includes("okhttp") || // Common for Android builds
      userAgent.toLowerCase().includes("cfnetwork"); // Common for iOS builds

    const decision = await aj.protect(req, {
      requested: 1, // each request consumes 1 token
    });

    if (decision.isDenied()) {
      // 1. If it's a Rate Limit, always block (to protect DB)
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please try again later.",
        });
      }

      // 2. If Arcjet thinks it's a bot, but it's actually our Mobile App, let it through
      if (decision.reason.isBot() && isMobileApp) {
        return next();
      }

      // 3. Otherwise, block (it's a real unauthorized bot or shield violation)
      return res.status(403).json({
        error: "Forbidden",
        message: "Access denied by security policy.",
      });
    }

    // Check for spoofed bots (except our own app)
    if (
      !isMobileApp &&
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed(),
      )
    ) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    // Fail-open: allow request to continue if Arcjet service has an issue
    next();
  }
};
