import { atom, useAtom } from "jotai";
import { toast } from "sonner";
import type { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/react";

type Contact = RouterOutputs["contact"]["getContacts"][number];
const selectedContactAtom = atom<Contact | null>(null);

export const useContact = () => {
  const utils = api.useUtils();
  const { data: contacts, isLoading } = api.contact.getContacts.useQuery();
  const { mutate: createContact } = api.contact.createContact.useMutation({
    onSuccess: () => {
      toast.success("Contact created successfully");
      void utils.contact.getContacts.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [selectedContact, setSelectedContact] = useAtom(selectedContactAtom);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  return {
    contacts,
    isLoading,
    createContact,
    selectedContact,
    handleSelectContact,
  };
};
