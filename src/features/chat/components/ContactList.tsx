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
import { AddContactDialog } from "./AddContactDialog";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

interface ContactListProps {
  contacts: Contact[];
  selectedContactId?: string;
  onSelectContact: (contactId: string) => void;
  onAddContact: (name: string) => void;
}

export function ContactList({
  contacts,
  selectedContactId,
  onSelectContact,
  onAddContact,
}: ContactListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
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
        {filteredContacts.map((contact) => (
          <Card
            key={contact.id}
            className={`hover:bg-accent mx-2 mb-1 cursor-pointer border-0 p-3 transition-colors ${
              selectedContactId === contact.id ? "bg-accent" : ""
            }`}
            onClick={() => onSelectContact(contact.id)}
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback>
                  {contact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{contact.name}</h3>
                  {contact.lastMessageTime && (
                    <span className="text-muted-foreground text-xs">
                      {contact.lastMessageTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
                {contact.lastMessage && (
                  <p className="text-muted-foreground truncate text-sm">
                    {contact.lastMessage}
                  </p>
                )}
              </div>
              {contact.unreadCount ? (
                <div className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-xs">
                  {contact.unreadCount}
                </div>
              ) : null}
            </div>
          </Card>
        ))}
      </div>

      <AddContactDialog
        isOpen={isAddContactOpen}
        onClose={() => setIsAddContactOpen(false)}
        onAddContact={onAddContact}
      />
    </div>
  );
}
