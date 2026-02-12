# Instagram Clone (Backend - Convex)

The real-time serverless engine for the Instagram Clone. Built with **Convex**, this backend handles real-time data synchronization, multi-table relational queries, and automated cloud file storage for media.

## 🛠 Tech Stack

* **Backend Platform:** [Convex](https://www.convex.dev/) (Serverless)
* **Authentication:** **Clerk** (Integrated via Webhooks & JWT)
* **Language:** TypeScript
* **Security:** Svix (Webhook verification)
* **File Storage:** Convex HTTP Actions & Storage API

## 🚀 Key Features

* **Real-time Sync:** Automatic UI updates for likes, comments, and follower counts without manual polling.
* **Complex Schema:** Relational data modeling for Users, Posts, Likes, Comments, Follows, Notifications, and Bookmarks.
* **Clerk Webhook Integration:** Automated user provisioning in the Convex database upon Clerk sign-up via `http.ts`.
* **Cloud File Management:** Direct-to-cloud image uploads and automated cleanup of storage objects upon post deletion.
* **Notification System:** Event-driven notification triggers for social interactions (likes, comments, follows).
* **Advanced Indexing:** High-performance queries using specialized indices (e.g., `by_user_and_post`, `by_follower`).

## 📂 Backend Structure (Convex/)

```text
convex/
├── schema.ts          # Relational database definitions & indices
├── users.ts           # User profiles, follow logic, and auth helpers
├── posts.ts           # Post CRUD, like/unlike, and storage handling
├── comments.ts        # Nested commenting logic and post counters
├── notifications.ts   # Social activity stream queries
├── bookmarks.ts       # Save/Archive post functionality
├── http.ts            # Clerk Webhook receiver & HTTP actions
└── _generated/        # Type-safe client and server helpers

```

## ⚙️ Development & Deployment

### Local Development

1. **Install Convex CLI:** `npm install -g convex`
2. **Setup:** Run `npx convex dev` to sync your schema and functions to the cloud.
3. **Environment Variables:** Set your `CLERK_WEBHOOK_SECRET` in the Convex Dashboard.

### Key Scripts

* `npx convex dev`: Starts a development server with real-time schema syncing.
* `npx convex dashboard`: Opens the data browser to inspect tables and storage.

---

**Next Step:** Since Project #06 uses a serverless approach, would you like me to generate the **Root README** or the **LinkedIn post** to highlight your new expertise in **Real-time Serverless Architectures**?