import { DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Dialog, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export function DialogCreateDistributor() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Adicionar distribuidor</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastro de Distribuidor</DialogTitle>
          <DialogDescription>Preencha as informações abaixo para cadastrar um distribuidor.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-row-4 items-center gap-4">
            <Label htmlFor="FIRST_NAME">Primeiro nome</Label>
            <Input id="FIRST_NAME" type="text" />
          </div>
          <div className="grid grid-row-4 items-center gap-4">
            <Label htmlFor="LAST_NAME">Segundo nome</Label>
            <Input id="LAST_NAME" type="text" />
          </div>
          <div className="grid grid-row-4 items-center gap-4">
            <Label htmlFor="FIRST_NAME">Primeiro nome</Label>
            <Input id="FIRST_NAME" type="text" />
          </div>
          <div className="grid grid-row-4 items-center gap-4">
            <Label htmlFor="FIRST_NAME">Primeiro nome</Label>
            <Input id="FIRST_NAME" type="text" />
          </div>
          <div className="grid grid-row-4 items-center gap-4">
            <Label htmlFor="FIRST_NAME">Primeiro nome</Label>
            <Input id="FIRST_NAME" type="text" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}