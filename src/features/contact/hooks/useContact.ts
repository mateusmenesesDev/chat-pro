import { toast } from "sonner";
import { api } from "~/trpc/react";

export const useContact = () => {
  const { data: contacts, isLoading } = api.contact.getContacts.useQuery();
  const { mutate: createContact } = api.contact.createContact.useMutation({
    onSuccess: () => {
      toast.success("Contact created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { contacts, isLoading, createContact };
};
