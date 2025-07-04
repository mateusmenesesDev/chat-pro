"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Button } from "~/common/components/ui/button";
import { Card } from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import { useContact } from "../hooks/useContact";
import { AddContactDialog } from "./AddContactDialog";

export function ContactList() {
  const { contacts, isLoading, handleSelectContact, selectedContact } =
    useContact();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-muted-foreground">Loading contacts...</p>
      </div>
    );
  }

  const filteredContacts = contacts?.filter((contact) =>
    contact?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (contacts?.length === 0) {
    return (
      <>
        <div className="flex h-full flex-col items-center justify-center">
          <p className="text-muted-foreground">No contacts found</p>
          <Button
            variant="outline"
            onClick={() => {
              setIsAddContactOpen(true);
            }}
            className="mt-4"
          >
            Add Contact
          </Button>
        </div>

        <AddContactDialog
          isOpen={isAddContactOpen}
          onClose={() => setIsAddContactOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 p-3">
          <div className="flex-1">
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background/50"
            />
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setIsAddContactOpen(true)}
            className="shrink-0"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts?.map(
            (contact) =>
              contact && (
                <Card
                  key={contact?.id}
                  className={`hover:bg-accent mx-2 mb-1 cursor-pointer border-0 p-3 transition-colors ${
                    selectedContact?.id === contact?.id ? "bg-accent" : ""
                  }`}
                  onClick={() => handleSelectContact(contact)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={contact.imageUrl}
                        alt={contact.name ?? ""}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <AvatarFallback className="text-sm">
                        {contact.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{contact.name}</h3>
                        {contact.createdAt && (
                          <span className="text-muted-foreground text-xs">
                            {contact.createdAt.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                      {contact.email && (
                        <p className="text-muted-foreground truncate text-sm">
                          {contact.email}
                        </p>
                      )}
                    </div>
                    {/* TODO: Add unread count */}
                    {/* {contact.unreadCount ? (
                <div className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-xs">
                  {contact.unreadCount}
                </div>
              ) : null} */}
                  </div>
                </Card>
              ),
          )}
        </div>
      </div>

      <AddContactDialog
        isOpen={isAddContactOpen}
        onClose={() => setIsAddContactOpen(false)}
      />
    </>
  );
}
