
import React, { useEffect } from "react";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Role management
export const roles = [
  "Администратор", 
  "Техник", 
  "Инвентаризатор", 
  "Менеджер", 
  "Пользователь"
];

export const departments = [
  "ИТ отдел", 
  "Бухгалтерия", 
  "Руководство", 
  "Отдел продаж", 
  "Другое"
];

export type UserFormData = {
  id?: number;
  name: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
};

// Form validation schema
const userFormSchema = z.object({
  name: z.string().min(2, { message: "Имя должно содержать минимум 2 символа" }),
  email: z.string().email({ message: "Введите корректный email адрес" }),
  role: z.string().min(1, { message: "Выберите роль" }),
  department: z.string().min(1, { message: "Выберите отдел" }),
  isActive: z.boolean().default(true),
});

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
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "Пользователь",
      department: user?.department || "",
      isActive: user?.isActive !== undefined ? user.isActive : true,
    }
  });

  // Update form when user prop changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        isActive: user.isActive
      });
    } else {
      form.reset({
        name: "",
        email: "",
        role: "Пользователь",
        department: "",
        isActive: true
      });
    }
  }, [user, form, open]);

  const handleFormSubmit = (data: z.infer<typeof userFormSchema>) => {
    // Make sure to include all required fields from UserFormData
    onSubmit({
      ...data,
      id: user?.id,
      name: data.name, // Explicitly include name to ensure it's not optional
      email: data.email,
      role: data.role,
      department: data.department,
      isActive: data.isActive
    });
  };

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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя пользователя</FormLabel>
                  <FormControl>
                    <Input placeholder="Иванов Иван" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ivanov@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Роль</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Отдел</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите отдел" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Активный пользователь
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type="submit">
                {mode === "add" ? "Добавить" : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
