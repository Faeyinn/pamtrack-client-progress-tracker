"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Loader2,
  Calendar as CalendarIcon,
  User,
  Phone,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface NewProjectModalProps {
  onSuccess: () => void;
  triggerButton?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NewProjectModal({
  onSuccess,
  triggerButton = true,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: NewProjectModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    projectName: "",
  });

  // Support both controlled and uncontrolled modes
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = controlledOnOpenChange || setInternalOpen;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!date) {
      toast.error("Deadline proyek harus diisi");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        deadline: date.toISOString(),
      };

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsOpen(false);
        setFormData({
          clientName: "",
          clientPhone: "",
          projectName: "",
        });
        setDate(undefined);
        onSuccess();
        toast.success("Proyek berhasil dibuat!", {
          description: "Token unik telah di-generate untuk klien.",
        });
      } else {
        toast.error("Gagal membuat proyek");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-background/95 backdrop-blur-2xl border-border/40 rounded-[2.5rem] shadow-2xl">
      {/* Premium Header */}
      <div className="relative p-8 pb-6 border-b border-border/40 overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

        <DialogHeader className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
              Tambah Proyek
            </p>
          </div>
          <DialogTitle className="text-3xl font-black tracking-tighter text-foreground uppercase leading-tight">
            Proyek Baru<span className="text-primary">.</span>
          </DialogTitle>
          <DialogDescription className="text-xs font-medium text-muted-foreground/80 uppercase tracking-widest mt-1">
            Masukkan data proyek baru untuk mulai memantau perkembangan.
          </DialogDescription>
        </DialogHeader>
      </div>

      <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
        <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {/* Client Intelligence Section */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 px-1">
              Data Client
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="clientName"
                  className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-70"
                >
                  Nama Client
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-foreground transition-all duration-300" />
                  <Input
                    id="clientName"
                    placeholder="Contoh: PT Angkasa Jaya"
                    className="pl-12 h-14 rounded-2xl bg-muted/30 border-border/40 focus:ring-2 focus:ring-foreground/5 transition-all text-xs font-bold"
                    value={formData.clientName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="clientPhone"
                  className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-70"
                >
                  Nomor WhatsApp
                </Label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-foreground transition-all duration-300" />
                  <Input
                    id="clientPhone"
                    placeholder="08xxxxxxxx"
                    type="tel"
                    className="pl-12 h-14 rounded-2xl bg-muted/30 border-border/40 focus:ring-2 focus:ring-foreground/5 transition-all text-xs font-bold"
                    value={formData.clientPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Project Parameters Section */}
          <div className="space-y-4 pt-4 border-t border-border/10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 px-1">
              Detail Proyek
            </h4>

            <div className="space-y-2">
              <Label
                htmlFor="projectName"
                className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-70"
              >
                Nama Proyek
              </Label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-foreground transition-all duration-300" />
                <Input
                  id="projectName"
                  placeholder="Contoh: Website E-Commerce"
                  className="pl-12 h-14 rounded-2xl bg-muted/30 border-border/40 focus:ring-2 focus:ring-foreground/5 transition-all text-xs font-bold"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-70">
                Batas Waktu Pengerjaan
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left h-14 px-4 rounded-2xl bg-muted/30 border-border/40 transition-all duration-300 hover:bg-muted/50 text-xs font-bold",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-3 h-4 w-4 shrink-0 opacity-40" />
                    {date ? (
                      format(date, "PPP")
                    ) : (
                      <span className="opacity-40 uppercase tracking-widest font-black text-[9px]">
                        Pilih Tanggal Selesai
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 rounded-3xl overflow-hidden border-border/40 shadow-2xl"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="bg-background"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-4 pt-4 border-t border-border/10">
          <Button
            variant="ghost"
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/50 transition-all"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:flex-1 h-14 px-8 rounded-2xl bg-foreground text-background font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-foreground/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Sparkles className="mr-3 h-4 w-4" />
                Simpan Proyek
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );

  if (!triggerButton) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          data-new-project-trigger
          className="h-11 px-6 rounded-xl bg-foreground text-background font-black text-[10px] uppercase tracking-widest shadow-xl shadow-foreground/10 hover:shadow-foreground/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Tambah Proyek</span>
          <span className="sm:hidden">Baru</span>
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
