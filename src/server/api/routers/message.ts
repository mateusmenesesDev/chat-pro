import { TRPCError } from "@trpc/server";
import { observable, type Observer } from "@trpc/server/observable";
import { eq, type InferSelectModel } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { conversations, messages } from "~/server/db/schema";

// Set max listeners to avoid memory leaks
const MAX_LISTENERS = 20;

type Message = InferSelectModel<typeof messages>;

interface MessageEvent {
  type: "state" | "message";
  state?: string;
  message?: Message;
}

const messageEvents = new Map<string, Set<(message: Message) => void>>();

export const messageRouter = createTRPCRouter({
  onNewMessage: publicProcedure.subscription(() => {
    return observable<MessageEvent>((emit: Observer<MessageEvent, unknown>) => {
      const onMessage = (message: Message) => {
        emit.next({ type: "message", message });
      };

      const listeners = messageEvents.get("global") ?? new Set();
      listeners.add(onMessage);
      messageEvents.set("global", listeners);

      emit.next({ type: "state", state: "connected" });

      return () => {
        const listeners = messageEvents.get("global");
        if (listeners) {
          listeners.delete(onMessage);
          if (listeners.size === 0) {
            messageEvents.delete("global");
          }
        }
      };
    });
  }),

  send: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        recipientId: z.string(),
        conversationId: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { message: content, recipientId, conversationId } = input;
        const { userId } = ctx.session;

        let conversationToUse = conversationId;
        if (!conversationToUse) {
          const conversation = await db.query.conversations.findFirst({
            where: (con, { or, and, eq }) =>
              or(
                and(eq(con.userAId, userId), eq(con.userBId, recipientId)),
                and(eq(con.userBId, userId), eq(con.userAId, recipientId)),
              ),
          });

          if (conversation) {
            conversationToUse = conversation.id;
          } else {
            const [newConversation] = await db
              .insert(conversations)
              .values({
                id: nanoid(),
                userAId: userId,
                userBId: recipientId,
                createdAt: new Date(),
                lastMessageAt: new Date(),
              })
              .returning();

            if (!newConversation) {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create conversation",
              });
            }

            conversationToUse = newConversation.id;
          }
        }

        const messageData = {
          id: nanoid(),
          conversationId: conversationToUse,
          senderId: userId,
          content,
          sentAt: new Date(),
          readAt: null,
        } satisfies Message;

        const [createdMessage] = await db
          .insert(messages)
          .values(messageData)
          .returning();

        if (!createdMessage) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create message",
          });
        }

        await db
          .update(conversations)
          .set({ lastMessageAt: new Date() })
          .where(eq(conversations.id, conversationToUse));

        // Notify all listeners
        const listeners = messageEvents.get("global");
        if (listeners) {
          for (const listener of listeners) {
            listener(messageData);
          }
        }

        return messageData;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send message",
          cause: error,
        });
      }
    }),

  getByConversationByContactId: protectedProcedure
    .input(z.object({ contactId: z.string() }))
    .query(async ({ ctx, input }) => {
      const conversation = await db.query.conversations.findFirst({
        where: (con, { or, and, eq }) =>
          or(
            and(
              eq(con.userAId, ctx.session.userId),
              eq(con.userBId, input.contactId),
            ),
            and(
              eq(con.userBId, ctx.session.userId),
              eq(con.userAId, input.contactId),
            ),
          ),
        with: {
          messages: {
            orderBy: (msg, { asc }) => asc(msg.sentAt),
          },
        },
      });

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      return conversation;
    }),
});
