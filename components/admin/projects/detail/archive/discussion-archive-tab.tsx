"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilePlus2, Link2, Trash2, ExternalLink, FileText } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useArtifacts } from "@/components/admin/projects/hooks/detail/use-artifacts";
import { ARTIFACT_TYPES, PROJECT_PHASES } from "@/lib/project-phase";
import type { ArtifactType, ProjectPhase } from "@/lib/types/project";
import { cn } from "@/lib/utils";

type UploadMode = "file" | "link";

export function DiscussionArchiveTab({ projectId }: { projectId: string }) {
  const { artifacts, isLoading, error, createArtifact, deleteArtifact } =
    useArtifacts(projectId);

  const [open, setOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<UploadMode>("file");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phase, setPhase] = useState<ProjectPhase>("DISCOVERY");
  const [type, setType] = useState<ArtifactType>("WIREFRAME");
  const [sourceLinkUrl, setSourceLinkUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false;
    if (uploadMode === "file") return Boolean(file);
    return /^https?:\/\//i.test(sourceLinkUrl.trim());
  }, [title, uploadMode, file, sourceLinkUrl]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      const form = new FormData();
      form.set("title", title);
      form.set("description", description);
      form.set("phase", phase);
      form.set("type", type);

      if (uploadMode === "file" && file) {
        form.set("file", file);
      } else {
        form.set("sourceLinkUrl", sourceLinkUrl.trim());
      }

      await createArtifact(form);
      toast.success("Document berhasil disimpan");

      setOpen(false);
      setTitle("");
      setDescription("");
      setSourceLinkUrl("");
      setFile(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menyimpan document",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete(id: string) {
    try {
      await deleteArtifact(id);
      toast.success("Document dihapus");
      setItemToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus");
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-black tracking-tighter uppercase text-foreground">
            Dokumen Proyek
          </h2>
          <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            Pusat penyimpanan asset, wireframe, dan dokumentasi proyek.
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-2xl shadow-2xl shadow-foreground/10 bg-foreground hover:bg-foreground/90 text-background gap-3 group transition-all active:scale-95">
              <FilePlus2 className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-xs font-black uppercase tracking-widest">
                Tambah Dokumen
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl bg-background/95 backdrop-blur-2xl border-border/40 rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tighter uppercase">
                Tambah Dokumen Baru
              </DialogTitle>
              <DialogDescription className="text-xs font-medium uppercase tracking-widest opacity-60">
                Data akan tersinkronisasi secara real-time ke portal klien.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="space-y-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                    Nama Dokumen *
                  </Label>
                  <Input
                    placeholder="Contoh: Wireframe V1.0"
                    className="h-12 rounded-xl bg-muted/30 border-border/40"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                    Fase Proyek *
                  </Label>
                  <Select
                    value={phase}
                    onValueChange={(v) => setPhase(v as ProjectPhase)}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/40">
                      <SelectValue placeholder="Pilih fase" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_PHASES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                    Tipe Dokumen
                  </Label>
                  <Select
                    value={type}
                    onValueChange={(v) => setType(v as ArtifactType)}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/40">
                      <SelectValue placeholder="Pilih type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ARTIFACT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                    Mode Input
                  </Label>
                  <div className="flex p-1 bg-muted/30 rounded-xl border border-border/40 h-12">
                    <button
                      type="button"
                      onClick={() => setUploadMode("file")}
                      className={cn(
                        "flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        uploadMode === "file"
                          ? "bg-background shadow-sm text-foreground"
                          : "text-muted-foreground hover:bg-background/50",
                      )}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode("link")}
                      className={cn(
                        "flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        uploadMode === "link"
                          ? "bg-background shadow-sm text-foreground"
                          : "text-muted-foreground hover:bg-background/50",
                      )}
                    >
                      Link External
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                  Catatan Tambahan
                </Label>
                <Textarea
                  placeholder="Berikan konteks sinkat untuk klien..."
                  className="rounded-xl bg-muted/30 border-border/40 min-h-[100px] resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="p-4 bg-foreground/5 rounded-2xl border border-foreground/5">
                {uploadMode === "file" ? (
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest">
                      Pilih File Utama
                    </Label>
                    <Input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="bg-background border-border/40 h-auto py-4 px-4 file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-foreground file:text-background hover:file:bg-foreground/90 cursor-pointer border-2 border-dashed transition-all hover:bg-muted/30"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest">
                      Alamat URL Link
                    </Label>
                    <div className="relative">
                      <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        className="pl-12 h-12 rounded-xl bg-background border-border/40"
                        placeholder="https://figma.com/file/..."
                        value={sourceLinkUrl}
                        onChange={(e) => setSourceLinkUrl(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/10">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest"
                  onClick={() => setOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 rounded-xl bg-foreground text-background text-xs font-black uppercase tracking-widest hover:bg-foreground/90 transition-all active:scale-95 shadow-xl shadow-foreground/10"
                  disabled={!canSubmit || submitting}
                >
                  {submitting ? "Menyimpan..." : "Simpan Dokumen"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={(val) => !val && setItemToDelete(null)}
      >
        <AlertDialogContent className="rounded-[2rem] border-border/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black uppercase tracking-tighter">
              Hapus Dokumen?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium leading-relaxed">
              Apakah Anda yakin ingin menghapus data ini?
              {itemToDelete && (
                <span className="block mt-3 px-4 py-3 bg-muted/50 rounded-xl font-black text-foreground border border-border/40 italic">
                  &quot;{artifacts.find((a) => a.id === itemToDelete)?.title}
                  &quot;
                </span>
              )}
              Tindakan ini permanen. File di server juga akan segera
              dimusnahkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl font-black uppercase tracking-widest text-[10px]">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => itemToDelete && confirmDelete(itemToDelete)}
              className="bg-destructive text-white hover:bg-destructive/90 rounded-xl font-black uppercase tracking-widest text-[10px]"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {error && (
        <div className="p-6 bg-destructive/5 border border-destructive/20 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center text-white shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-destructive uppercase tracking-widest">
            {error}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={i}
                className="border-none bg-muted/40 rounded-3xl h-48"
              >
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-1/2 rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-20 rounded-full" />
                    <Skeleton className="h-4 w-20 rounded-full" />
                  </div>
                </div>
              </Card>
            ))}
          </>
        ) : artifacts.length === 0 ? (
          <div className="col-span-full py-20 bg-muted/5 border-2 border-dashed border-border/40 rounded-[2.5rem] flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 rounded-3xl bg-background flex items-center justify-center mb-6 shadow-2xl shadow-foreground/5 transform -rotate-6">
              <FileText className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-black tracking-tighter uppercase mb-2">
              Belum Ada Dokumen
            </h3>
            <p className="text-xs text-muted-foreground font-medium max-w-xs uppercase tracking-widest opacity-60">
              Mulai dengan mengunggah wireframe atau dokumen brief proyek.
            </p>
          </div>
        ) : (
          artifacts.map((a) => (
            <div
              key={a.id}
              className="group relative bg-background/50 backdrop-blur-sm border border-border/40 rounded-[2rem] p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-foreground/5 hover:-translate-y-1 overflow-hidden"
            >
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:scale-150" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <h3 className="text-lg font-black tracking-tighter uppercase text-foreground truncate">
                      {a.title}
                    </h3>
                    <div className="flex gap-2 mt-2">
                      <div className="px-3 py-1 rounded-full bg-foreground text-background text-[9px] font-black uppercase tracking-widest">
                        {a.phase}
                      </div>
                      {a.type && (
                        <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-[9px] font-black uppercase tracking-widest border border-border/50">
                          {a.type}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                    onClick={() => setItemToDelete(a.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {a.description && (
                  <p className="text-xs text-muted-foreground/80 font-medium mb-6 line-clamp-2 leading-relaxed italic">
                    &quot;{a.description}&quot;
                  </p>
                )}

                <div className="flex flex-wrap gap-2.5">
                  {a.fileUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2.5 border-border/40 bg-background/50 hover:bg-foreground hover:text-background transition-all shadow-sm active:scale-95"
                    >
                      <a href={a.fileUrl} target="_blank" rel="noreferrer">
                        <FileText className="w-4 h-4" /> Buka Dokumen
                      </a>
                    </Button>
                  )}
                  {a.sourceLinkUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2.5 border-border/40 bg-background/50 hover:bg-foreground hover:text-background transition-all shadow-sm active:scale-95 group/btn"
                    >
                      <a
                        href={a.sourceLinkUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        Kunjungi Link
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
