
import React from "react";
import { useForm } from "react-hook-form";
import { UserCog, UserPlus } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export type UserFormData = {
  id?: number;
  name: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
};

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserFormData) => void;
  user?: UserFormData | null;
  mode: "add" | "edit";
}

const UserDialog = ({
  open,
  onOpenChange,
  onSubmit,
  user,
  mode
}: UserDialogProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<UserFormData>({
    defaultValues: user || {
      name: "",
      email: "",
      role: "Пользователь",
      department: "",
      isActive: true,
    }
  });

  // Set form values when user prop changes
  React.useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("role", user.role);
      setValue("department", user.department);
      setValue("isActive", user.isActive);
    }
  }, [user, setValue]);

  const isActive = watch("isActive");

  const roles = ["Администратор", "Техник", "Инвентаризатор", "Менеджер", "Пользователь"];
  const departments = ["ИТ отдел", "Бухгалтерия", "Руководство", "Отдел продаж", "Другое"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? (
              <div className="flex items-center">
                <UserPlus className="mr-2 h-5 w-5" />
                Добавить пользователя
              </div>
            ) : (
              <div className="flex items-center">
                <UserCog className="mr-2 h-5 w-5" />
                Редактировать пользователя
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? "Заполните форму для добавления нового пользователя" 
              : "Внесите необходимые изменения"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Имя пользователя</Label>
              <Input
                id="name"
                {...register("name", { required: "Имя обязательно" })}
                placeholder="Иванов Иван"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { 
                  required: "Email обязателен",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Неверный формат email"
                  }
                })}
                placeholder="ivanov@example.com"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Роль</Label>
              <Select 
                defaultValue={user?.role || "Пользователь"}
                onValueChange={(value) => setValue("role", value)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department">Отдел</Label>
              <Select 
                defaultValue={user?.department || ""}
                onValueChange={(value) => setValue("department", value)}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Выберите отдел" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isActive" 
                checked={isActive}
                onCheckedChange={(checked) => setValue("isActive", !!checked)} 
              />
              <Label htmlFor="isActive">Активный пользователь</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">
              {mode === "add" ? "Добавить" : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
