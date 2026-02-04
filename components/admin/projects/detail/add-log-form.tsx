"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Send,
  FileText,
  MessageSquare,
  Bell,
  ImageIcon,
  Link2,
  Plus,
  Trash2,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAddLog } from "@/components/admin/projects/hooks/detail/use-add-log";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECT_PHASES } from "@/lib/project-phase";
import { useState } from "react";

interface AddLogFormProps {
  projectId: string;
  currentPhase?: "DEVELOPMENT" | "MAINTENANCE";
  developmentProgress?: number;
  maintenanceProgress?: number;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function AddLogForm({
  projectId,
  developmentProgress = 0,
  onSuccess,
  onCancel,
}: AddLogFormProps) {
  const [selectedWorkPhase, setSelectedWorkPhase] = useState<
    "DEVELOPMENT" | "MAINTENANCE"
  >("DEVELOPMENT");
  const {
    isSubmitting,
    logForm,
    setLogForm,
    handleSubmit: baseHandleSubmit,
  } = useAddLog(projectId, onSuccess, selectedWorkPhase);
  const [showVisuals, setShowVisuals] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Check if Maintenance is unlocked
  const isMaintenanceUnlocked = developmentProgress === 100;
  const isMaintenancePhase = selectedWorkPhase === "MAINTENANCE";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      alert("Maksimal 5 gambar");
      return;
    }

    setLogForm({ ...logForm, images: files });

    // Generate previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    // Cleanup old previews to avoid memory leaks
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImagePreviews(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    baseHandleSubmit(e);
  };

  const addLink = () => {
    setLogForm({
      ...logForm,
      links: [...logForm.links, { label: "", url: "" }],
    });
  };

  const removeLink = (index: number) => {
    setLogForm({
      ...logForm,
      links: logForm.links.filter((_, i) => i !== index),
    });
  };

  const updateLink = (index: number, field: "label" | "url", value: string) => {
    setLogForm({
      ...logForm,
      links: logForm.links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link,
      ),
    });
  };

  const handlePhaseChange = (phase: "DEVELOPMENT" | "MAINTENANCE") => {
    setSelectedWorkPhase(phase);
    // Reset percentage when changing phase
    setLogForm({ ...logForm, percentage: "" });

    // Auto-sync visual phase and handle percentage
    if (phase === "MAINTENANCE") {
      setLogForm((prev) => ({
        ...prev,
        percentage: "100",
        phase: "MAINTENANCE",
      }));
    } else {
      setLogForm((prev) => ({ ...prev, percentage: "", phase: "DEVELOPMENT" }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar p-1"
    >
      {/* Section 1: Progress Context */}
      <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 space-y-4">
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
            Fase Pengerjaan
          </Label>
          <div className="flex p-1 bg-background/50 rounded-xl border border-border/50">
            {/* Development Toggle */}
            <button
              type="button"
              onClick={() => handlePhaseChange("DEVELOPMENT")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-wider",
                selectedWorkPhase === "DEVELOPMENT"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:bg-foreground/5",
              )}
            >
              Development
              {selectedWorkPhase === "DEVELOPMENT" && (
                <div className="w-1.5 h-1.5 rounded-full bg-background animate-pulse" />
              )}
            </button>

            {/* Maintenance Toggle */}
            <button
              type="button"
              onClick={() => handlePhaseChange("MAINTENANCE")}
              disabled={!isMaintenanceUnlocked}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-wider",
                !isMaintenanceUnlocked
                  ? "opacity-40 cursor-not-allowed"
                  : selectedWorkPhase === "MAINTENANCE"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-amber-500/10",
              )}
            >
              Maintenance
              {selectedWorkPhase === "MAINTENANCE" && (
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>
          </div>

          {!isMaintenanceUnlocked && (
            <div className="flex items-center gap-2 px-1">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              <p className="text-[9px] font-bold text-amber-600 uppercase tracking-tight">
                Maintenance terbuka setelah development 100%
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="percentage"
              className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80"
            >
              {selectedWorkPhase === "DEVELOPMENT"
                ? "Update Progres"
                : "Status Proyek"}
            </Label>

            {selectedWorkPhase === "DEVELOPMENT" ? (
              <div className="relative">
                <Input
                  id="percentage"
                  type="number"
                  min={developmentProgress}
                  max="100"
                  placeholder={developmentProgress.toString()}
                  value={logForm.percentage}
                  onChange={(e) =>
                    setLogForm({ ...logForm, percentage: e.target.value })
                  }
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  required
                  disabled={isSubmitting}
                  className="h-11 bg-background border-border/50 focus:border-foreground/30 transition-all font-black text-sm pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground pointer-events-none">
                  %
                </span>
              </div>
            ) : (
              <div className="h-11 flex items-center px-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-amber-600 mr-2 shrink-0" />
                <span className="text-xs font-black text-amber-700 uppercase tracking-wider">
                  Mode Pemeliharaan
                </span>
              </div>
            )}
            <p className="text-[9px] text-muted-foreground/60 font-bold px-1 uppercase tracking-tighter">
              {selectedWorkPhase === "DEVELOPMENT"
                ? `Minimal pengerjaan: ${developmentProgress}%`
                : "Progres terkunci di 100%"}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
              Pratinjau Visual
            </Label>
            <div className="h-11 flex items-center px-4 bg-background border border-border/50 rounded-xl relative overflow-hidden group">
              {selectedWorkPhase === "DEVELOPMENT" ? (
                <>
                  <div className="absolute inset-y-0 left-0 bg-foreground/5 w-full transition-all group-hover:bg-foreground/10" />
                  <div
                    className="absolute inset-y-0 left-0 bg-foreground transition-all duration-700 ease-out shadow-[0_0_15px_rgba(0,0,0,0.1)]"
                    style={{
                      width: `${Math.min(Number(logForm.percentage || 0), 100)}%`,
                    }}
                  />
                  <span className="relative z-10 text-xs font-black tabular-nums mix-blend-difference text-white">
                    {logForm.percentage || 0}% Selesai
                  </span>
                </>
              ) : (
                <span className="text-[10px] font-bold text-muted-foreground italic tracking-tight">
                  Fase pasca-rilis aktif
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Log Content */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="title"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 flex items-center gap-1.5"
          >
            <FileText className="w-3 h-3" /> Judul Progress
          </Label>
          <Input
            id="title"
            placeholder="Contoh: Slicing UI Dashboard"
            value={logForm.title}
            onChange={(e) => setLogForm({ ...logForm, title: e.target.value })}
            required
            disabled={isSubmitting}
            className="h-11 bg-background border-border/50 focus:border-foreground/30 transition-all font-bold text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 flex items-center gap-1.5"
          >
            <MessageSquare className="w-3 h-3" /> Detail Pekerjaan
          </Label>
          <Textarea
            id="description"
            placeholder="Sebutkan fitur atau perbaikan detail..."
            value={logForm.description}
            onChange={(e) =>
              setLogForm({ ...logForm, description: e.target.value })
            }
            rows={3}
            required
            disabled={isSubmitting}
            className="resize-none bg-background border-border/50 focus:border-foreground/30 transition-all text-xs font-medium min-h-[100px] py-3"
          />
        </div>
      </div>

      {/* Section 3: Visual Attachments (Redesigned) */}
      <div className="bg-foreground/[0.02] p-4 rounded-2xl border border-border/50 border-dashed space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-foreground text-background flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <Label className="text-[10px] font-black uppercase tracking-widest text-foreground">
              Attachment Visual
            </Label>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowVisuals(!showVisuals)}
            className="h-7 text-[9px] font-black uppercase tracking-widest rounded-full opacity-60 hover:opacity-100"
          >
            {showVisuals ? "Sembunyikan" : "Tambah Visual"}
          </Button>
        </div>

        {showVisuals && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {selectedWorkPhase === "DEVELOPMENT" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-muted-foreground uppercase px-1">
                    Fase Detail
                  </Label>
                  <Select
                    value={logForm.phase}
                    onValueChange={(v) => setLogForm({ ...logForm, phase: v })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-background border-border/50 h-10 text-xs font-bold">
                      <SelectValue placeholder="Pilih fase..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_PHASES.filter((p) => p !== "MAINTENANCE").map(
                        (p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              <Label className="text-[9px] font-black text-muted-foreground uppercase px-1">
                Unggah Cuplikan Layar
              </Label>
              <div className="flex flex-col gap-3">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                  className="bg-background border-border/50 h-auto py-3 px-4 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-wider file:bg-foreground file:text-background border-dashed transition-all hover:bg-muted/50 cursor-pointer text-xs font-medium"
                />

                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 bg-background/50 rounded-xl border border-border/50 animate-in zoom-in-95 duration-200">
                    {imagePreviews.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 rounded-lg overflow-hidden border border-border/50 group"
                      >
                        <img
                          src={url}
                          alt={`preview ${idx}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                    ))}
                    {imagePreviews.length < 5 && (
                      <div className="w-16 h-16 rounded-lg border-2 border-dashed border-border/30 flex items-center justify-center text-muted-foreground/30">
                        <Plus className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                )}
                <p className="text-[9px] text-muted-foreground italic px-1">
                  Maksimal 5 file gambar (JPG, PNG).
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-t border-border/10 pt-4">
                <Label className="text-[9px] font-black text-muted-foreground uppercase px-1">
                  Links Eksternal
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={addLink}
                  className="h-6 px-2 text-[9px] font-black uppercase tracking-wider hover:bg-foreground/5 text-foreground/40"
                >
                  <Plus className="w-3 h-3 mr-1" /> Tambah Link
                </Button>
              </div>

              <div className="space-y-2">
                {logForm.links.map((link, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 animate-in fade-in slide-in-from-right-2"
                  >
                    <Input
                      placeholder="e.g. Figma"
                      value={link.label}
                      onChange={(e) => updateLink(idx, "label", e.target.value)}
                      className="flex-1 h-9 text-[11px] font-bold"
                    />
                    <div className="relative flex-[2]">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                      <Input
                        placeholder="https://figma.com/..."
                        value={link.url}
                        onChange={(e) => updateLink(idx, "url", e.target.value)}
                        className="pl-8 h-9 text-[11px] font-medium"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLink(idx)}
                      className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/5 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Communication */}
      <div className="flex items-center gap-4 p-5 bg-background border border-border/50 rounded-2xl group transition-all hover:shadow-xl hover:shadow-foreground/5 shrink-0">
        <div className="relative">
          <input
            type="checkbox"
            id="sendNotification"
            checked={logForm.sendNotification}
            onChange={(e) =>
              setLogForm({ ...logForm, sendNotification: e.target.checked })
            }
            className={cn(
              "w-6 h-6 rounded-lg border-2 transition-all duration-300 cursor-pointer shadow-sm",
              "appearance-none bg-background border-border/50",
              "checked:bg-foreground checked:border-foreground checked:shadow-lg checked:shadow-foreground/20",
              "focus:ring-2 focus:ring-foreground/10 focus:ring-offset-2",
            )}
            disabled={isSubmitting}
          />
          {logForm.sendNotification && (
            <svg
              className="absolute top-1 left-1 w-4 h-4 text-background pointer-events-none stroke-[4] animate-in zoom-in duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <div
          className="flex flex-col flex-1 cursor-pointer select-none"
          onClick={() =>
            !isSubmitting &&
            setLogForm({
              ...logForm,
              sendNotification: !logForm.sendNotification,
            })
          }
        >
          <div className="flex items-center gap-2">
            <Bell
              className={cn(
                "w-4 h-4 transition-colors",
                logForm.sendNotification
                  ? "text-foreground"
                  : "text-muted-foreground/30",
              )}
            />
            <span className="text-xs font-black uppercase tracking-widest text-foreground/90">
              Kirim Update via WA
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground/70 font-medium leading-relaxed mt-0.5">
            Kirimkan ringkasan detail progress langsung ke klien.
          </p>
        </div>
      </div>

      {/* Section 5: Form Actions */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm pt-4 flex flex-col sm:flex-row gap-3 border-t border-border/10 pb-1">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-muted/80 text-muted-foreground"
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button
          type="submit"
          className="flex-1 h-12 rounded-xl bg-foreground hover:bg-foreground/90 text-background text-xs font-black uppercase tracking-widest shadow-2xl transition-all active:scale-[0.98] group"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-background/50" />
              <span>Memproses...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <span>Simpan Update</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
