import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("fundforge");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"]
    }
  },
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client,
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "supporter",
      },
      credits: {
        type: "number",
        required: false,
        defaultValue: 0,
      }
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role = user.role || "supporter";
          let initialCredits = 0;
          if (role === "supporter") {
            initialCredits = 50;
          } else if (role === "creator") {
            initialCredits = 20;
          }

          return {
            data: {
              ...user,
              emailVerified: true,
              credits: initialCredits,
            }
          }
        }
      }
    }
  }
});
