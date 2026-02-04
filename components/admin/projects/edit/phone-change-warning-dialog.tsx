"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2 } from "lucide-react";

interface PhoneChangeWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalPhone: string;
  newPhone: string;
  sendNotification: boolean;
  setSendNotification: (value: boolean) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function PhoneChangeWarningDialog({
  open,
  onOpenChange,
  originalPhone,
  newPhone,
  sendNotification,
  setSendNotification,
  onConfirm,
  isSubmitting,
}: PhoneChangeWarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-chart-5" />
            Peringatan Perubahan Nomor
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-2">
            <p>Nomor WhatsApp akan diubah dari:</p>
            <div className="bg-muted p-3 rounded-lg space-y-1">
              <p className="text-sm">
                <span className="font-semibold">Nomor Lama:</span>{" "}
                {originalPhone}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Nomor Baru:</span> {newPhone}
              </p>
            </div>
            <p className="text-chart-5 font-medium">
              ⚠️ Nomor lama tidak akan bisa recovery token lagi.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-start space-x-2 p-4 bg-muted/50 rounded-lg border border-border/50">
          <input
            type="checkbox"
            id="sendNotification"
            checked={sendNotification}
            onChange={(e) => setSendNotification(e.target.checked)}
            className="w-4 h-4 text-black rounded focus:ring-black mt-0.5 accent-black"
          />
          <Label htmlFor="sendNotification" className="cursor-pointer text-sm">
            Kirim notifikasi ke nomor baru dengan magic link
          </Label>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Ya, Simpan Perubahan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
