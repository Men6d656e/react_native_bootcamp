import {
  uniqueUsernameGenerator,
  adjectives,
  nouns,
} from "unique-username-generator";
import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import config from "../config/index.js";

// name genrator
export const uniqueNameGenrator = () => {
  return uniqueUsernameGenerator({
    dictionaries: [adjectives, nouns],
    separator: "-",
    randomDigits: 3,
    style: "lowerCase",
  });
};

// initialize Arcjet with security rules
export const aj = arcjet({
  key: config.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    // shield protects your app from common attacks e.g. SQL injection, XSS, CSRF attacks
    shield({ mode: "LIVE" }),

    // bot detection - block all bots except search engines
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:MONITOR",
        "CATEGORY:PREVIEW",
        // allow legitimate search engine bots
        // see full list at https://arcjet.com/bot-list
      ],
    }),

    // rate limiting with token bucket algorithm
    tokenBucket({
      mode: "LIVE",
      refillRate: 20, // tokens added per interval
      interval: 10, // interval in seconds (10 seconds)
      capacity: 30, // maximum tokens in bucket
    }),
  ],
});
