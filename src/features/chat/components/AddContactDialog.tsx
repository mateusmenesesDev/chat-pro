import { useState } from "react";
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

interface AddContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContact: (email: string) => void;
}

export function AddContactDialog({
  isOpen,
  onClose,
  onAddContact,
}: AddContactDialogProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onAddContact(email.trim());
      setEmail("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Enter the email of the person you want to add to your contacts.
            </DialogDescription>
          </DialogHeader>

          <div className="my-6">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Contact email"
              className="w-full"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!email.trim()}>
              Add Contact
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
