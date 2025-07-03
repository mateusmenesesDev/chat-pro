import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "~/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
  console.log(errors);

  const onSubmit: SubmitHandler<CreateContact> = (data) => {
    createContact(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
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
    </Dialog>
  );
}
