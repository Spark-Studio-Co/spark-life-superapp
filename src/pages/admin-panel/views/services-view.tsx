//@ts-nocheck
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { useGetServices } from "@/entities/services/hooks/use-services";

// Form schema for service
const serviceFormSchema = z.object({
  name: z.string().min(2, "Название должно содержать минимум 2 символа"),
  description: z
    .string()
    .min(10, "Описание должно содержать минимум 10 символов"),
  price: z
    .string()
    .min(1, "Укажите стоимость услуги")
    .refine((val) => !isNaN(Number(val)), {
      message: "Стоимость должна быть числом",
    }),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export function ServicesView() {
  const {
    data: services,
    isLoading,
    createService,
    updateService,
    deleteService,
  } = useGetServices();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Form for adding/editing service
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
    },
  });

  // Filter services based on search query
  const filteredServices =
    services?.filter(
      (service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Open add service dialog
  const openAddDialog = () => {
    form.reset();
    setIsAddDialogOpen(true);
  };

  // Open edit service dialog
  const openEditDialog = (service) => {
    setSelectedService(service);
    form.reset({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
    });
    setIsEditDialogOpen(true);
  };

  // Open delete service dialog
  const openDeleteDialog = (service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  // Handle form submission for adding service
  const onAddSubmit = async (data: ServiceFormValues) => {
    try {
      await createService.mutateAsync({
        name: data.name,
        description: data.description,
        price: Number.parseInt(data.price),
      });

      toast({
        title: "Услуга добавлена",
        description: "Новая услуга успешно добавлена в систему",
      });

      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding service:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить услугу",
        variant: "destructive",
      });
    }
  };

  // Handle form submission for editing service
  const onEditSubmit = async (data: ServiceFormValues) => {
    if (!selectedService) return;

    try {
      await updateService.mutateAsync({
        id: selectedService.id,
        data: {
          name: data.name,
          description: data.description,
          price: Number.parseInt(data.price),
        },
      });

      toast({
        title: "Услуга обновлена",
        description: "Информация об услуге успешно обновлена",
      });

      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating service:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить информацию об услуге",
        variant: "destructive",
      });
    }
  };

  // Handle service deletion
  const onDeleteConfirm = async () => {
    if (!selectedService) return;

    try {
      await deleteService.mutateAsync(selectedService.id);

      toast({
        title: "Услуга удалена",
        description: "Услуга успешно удалена из системы",
      });

      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить услугу",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Управление услугами</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Поиск услуг..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={openAddDialog} className="whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" /> Добавить услугу
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Услуги клиники</CardTitle>
          <CardDescription>
            Управляйте услугами, предоставляемыми вашей клиникой
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Стоимость</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">
                        {service.name}
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {service.description}
                      </TableCell>
                      <TableCell>{service.price} ₽</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Действия</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEditDialog(service)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(service)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Услуги не найдены</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Service Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить новую услугу</DialogTitle>
            <DialogDescription>
              Заполните информацию о новой услуге клиники
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onAddSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название услуги</FormLabel>
                    <FormControl>
                      <Input placeholder="Консультация терапевта" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Подробное описание услуги"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Стоимость (₽)</FormLabel>
                    <FormControl>
                      <Input placeholder="2000" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={createService.isPending}>
                  {createService.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    "Добавить услугу"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать услугу</DialogTitle>
            <DialogDescription>
              Измените информацию об услуге клиники
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onEditSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название услуги</FormLabel>
                    <FormControl>
                      <Input placeholder="Консультация терапевта" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Подробное описание услуги"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Стоимость (₽)</FormLabel>
                    <FormControl>
                      <Input placeholder="2000" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={updateService.isPending}>
                  {updateService.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    "Сохранить изменения"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Service Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить услугу</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить услугу "{selectedService?.name}"?
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onDeleteConfirm}
              disabled={deleteService.isPending}
            >
              {deleteService.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Удаление...
                </>
              ) : (
                "Удалить"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
