import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`,
    );
    console.log("Webhook payload:", evt.data);

    switch (evt.type) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name } = evt.data;
        const user = await db.query.users.findFirst({
          where: eq(users.id, id),
        });

        if (!user) {
          await db.insert(users).values({
            id,
            email: email_addresses[0]?.email_address,
            name: `${first_name} ${last_name}`,
          });
        }
        break;
      }
      case "user.updated": {
        const { id, email_addresses, first_name, last_name } = evt.data;
        const user = await db.query.users.findFirst({
          where: eq(users.id, id),
        });

        if (!user) {
          throw new Error("User not found");
        }

        await db
          .update(users)
          .set({
            email: email_addresses[0]?.email_address,
            name: `${first_name} ${last_name}`,
          })
          .where(eq(users.id, id));
        break;
      }
      case "user.deleted": {
        const { id } = evt.data;
        await db.delete(users).where(eq(users.id, id!));
        break;
      }
      default: {
        return new Response("Webhook received", { status: 200 });
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
