"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "~/common/components/ui/dialog";
import { Input } from "~/common/components/ui/input";
import { useContact } from "../hooks/useContact";
import {
  createContactSchema,
  type CreateContact,
} from "../schemas/Contact.schema";

interface AddContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddContactDialog({ isOpen, onClose }: AddContactDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateContact>({
    resolver: zodResolver(createContactSchema),
  });
  const { createContact } = useContact();

  const onSubmit: SubmitHandler<CreateContact> = (data) => {
    createContact(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[100] bg-black/50" />
        <DialogContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-[100] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-white p-6 shadow-lg dark:bg-gray-900">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>
                Enter the email of the person you want to add to your contacts.
              </DialogDescription>
            </DialogHeader>

            <div className="my-6">
              <Input
                {...register("email")}
                placeholder="Contact email"
                className="w-full"
                autoFocus
              />
              <p className="text-destructive mt-2 text-sm">
                {errors.email?.message}
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Add Contact</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
