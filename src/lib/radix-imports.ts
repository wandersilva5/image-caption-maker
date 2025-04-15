// Este arquivo centraliza as importações do Radix UI
// Em vez de usar wildcard imports, importamos cada componente específico

// Alert Dialog
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
// Dialog
import * as DialogPrimitive from "@radix-ui/react-dialog";
// Progress
import * as ProgressPrimitive from "@radix-ui/react-progress";
// Sheet (que usa Dialog internamente)
import * as SheetPrimitive from "@radix-ui/react-dialog";

// Exportamos todos os componentes para uso em outros arquivos
export {
  AlertDialogPrimitive,
  DialogPrimitive,
  ProgressPrimitive,
  SheetPrimitive
};