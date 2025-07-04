import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { and, eq, type InferSelectModel } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { contacts, users } from "~/server/db/schema";

type User = InferSelectModel<typeof users>;

export const contactRouter = createTRPCRouter({
  createContact: protectedProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session;
      const { email } = input;

      const contactUser = await ctx.db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (userId === contactUser?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot add yourself as a contact",
        });
      }

      if (!contactUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }

      const contactExists = await ctx.db.query.contacts.findFirst({
        where: and(
          eq(contacts.userId, userId),
          eq(contacts.contactId, contactUser.id),
        ),
      });

      if (contactExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Contact already exists",
        });
      }

      const userContactRequest = ctx.db.insert(contacts).values({
        userId,
        contactId: contactUser.id,
      });

      const contactUserRequest = ctx.db.insert(contacts).values({
        userId: contactUser.id,
        contactId: userId,
      });

      await Promise.all([userContactRequest, contactUserRequest]);
    }),

  getContacts: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session;
    const authClient = await clerkClient();
    const users = await authClient.users.getUserList();

    const contactsResult = await ctx.db.query.contacts.findMany({
      where: eq(contacts.userId, userId),
      with: {
        contact: true,
      },
    });

    const contactsWithImage = contactsResult.map(
      (contact: { contact: User | null }) => ({
        ...contact.contact,
        imageUrl: users.data.find((user) => user.id === contact.contact?.id)
          ?.imageUrl,
      }),
    );

    return contactsWithImage;
  }),
});
