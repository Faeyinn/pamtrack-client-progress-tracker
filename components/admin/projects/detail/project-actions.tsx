import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProjectActionsProps {
  projectId: string;
  onDelete: () => void;
}

export function ProjectActions({ projectId, onDelete }: ProjectActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/projects/${projectId}/edit`}>
        <Button variant="outline" size="sm" className="hidden sm:flex">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" size="icon" className="sm:hidden h-9 w-9">
          <Edit className="w-4 h-4" />
        </Button>
      </Link>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 hover:border-destructive/50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="sm:hidden h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 hover:border-destructive/50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex flex-col items-center gap-2 text-center sm:text-left sm:flex-row sm:gap-4 sm:items-start">
              <div className="p-3 rounded-full bg-destructive/10 shrink-0">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <div className="space-y-2">
                <AlertDialogTitle className="text-lg font-semibold text-foreground">
                  Hapus Proyek Ini?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground leading-relaxed">
                  Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini
                  tidak dapat dibatalkan dan akan menghapus seluruh data yang
                  terkait secara permanen.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:space-x-3 mt-4">
            <AlertDialogCancel className="font-medium hover:bg-muted">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 border-none font-medium px-5"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
