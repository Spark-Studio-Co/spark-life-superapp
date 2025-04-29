//@ts-nocheck

"use client";

import type React from "react";

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
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Star,
  Loader2,
} from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "@/components/ui/use-toast";
import { useGetServices } from "@/entities/services/hooks/use-services";
import { useGetDoctors } from "@/entities/doctor/hooks/use-doctors";

// Validation schema for doctor
const DoctorValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .required("Обязательное поле"),
  specialty: Yup.string()
    .min(2, "Укажите специальность")
    .required("Обязательное поле"),
  experience: Yup.string()
    .min(1, "Укажите опыт работы")
    .required("Обязательное поле"),
  education: Yup.string()
    .min(2, "Укажите образование")
    .required("Обязательное поле"),
  languages: Yup.string().min(2, "Укажите языки").required("Обязательное поле"),
  price: Yup.string()
    .min(1, "Укажите стоимость приема")
    .required("Обязательное поле"),
  about: Yup.string()
    .min(10, "Описание должно содержать минимум 10 символов")
    .required("Обязательное поле"),
  services: Yup.array()
    .min(1, "Выберите хотя бы одну услугу")
    .required("Обязательное поле"),
  accepts_insurance: Yup.array().of(Yup.string()),
});

export function DoctorsView() {
  const {
    data: doctors,
    isLoading,
    createDoctor,
    updateDoctor,
    deleteDoctor,
  } = useGetDoctors();
  const { data: services } = useGetServices();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Initial values for doctor form
  const initialValues = {
    name: "",
    specialty: "",
    experience: "",
    education: "",
    languages: "",
    price: "",
    about: "",
    services: [],
    accepts_insurance: ["ОМС"],
  };

  // Filter doctors based on search query
  const filteredDoctors =
    doctors?.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Handle photo change
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open add doctor dialog
  const openAddDialog = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsAddDialogOpen(true);
  };

  // Open edit doctor dialog
  const openEditDialog = (doctor) => {
    setSelectedDoctor(doctor);
    setPhotoPreview(doctor.photo);
    setIsEditDialogOpen(true);
  };

  // Open delete doctor dialog
  const openDeleteDialog = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDeleteDialogOpen(true);
  };

  // Handle form submission for adding doctor
  const onAddSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();

      // Add all form fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key === "services" || key === "accepts_insurance") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "education" || key === "languages") {
          formData.append(key, JSON.stringify(value.split(",")));
        } else {
          formData.append(key, value as string);
        }
      });

      // Add photo if selected
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      await createDoctor.mutateAsync(formData);

      toast({
        title: "Врач добавлен",
        description: "Новый врач успешно добавлен в систему",
      });

      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить врача",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form submission for editing doctor
  const onEditSubmit = async (values, { setSubmitting }) => {
    if (!selectedDoctor) return;

    try {
      const formData = new FormData();

      // Add all form fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key === "services" || key === "accepts_insurance") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "education" || key === "languages") {
          formData.append(key, JSON.stringify(value.split(",")));
        } else {
          formData.append(key, value as string);
        }
      });

      // Add photo if selected
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      await updateDoctor.mutateAsync({
        id: selectedDoctor.id,
        data: formData,
      });

      toast({
        title: "Врач обновлен",
        description: "Информация о враче успешно обновлена",
      });

      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating doctor:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить информацию о враче",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle doctor deletion
  const onDeleteConfirm = async () => {
    if (!selectedDoctor) return;

    try {
      await deleteDoctor.mutateAsync(selectedDoctor.id);

      toast({
        title: "Врач удален",
        description: "Врач успешно удален из системы",
      });

      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить врача",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Управление врачами</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Поиск врачей..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={openAddDialog} className="whitespace-nowrap">
            <Plus className="mr-2 h-4 w-4" /> Добавить врача
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Врачи клиники</CardTitle>
          <CardDescription>
            Управляйте информацией о врачах вашей клиники
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : filteredDoctors.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Фото</TableHead>
                    <TableHead>Имя</TableHead>
                    <TableHead>Специальность</TableHead>
                    <TableHead>Рейтинг</TableHead>
                    <TableHead>Опыт</TableHead>
                    <TableHead>Стоимость</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={
                              doctor.photo ||
                              "/placeholder.svg?height=40&width=40&query=doctor"
                            }
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {doctor.name}
                      </TableCell>
                      <TableCell>{doctor.specialty}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                          <span>{doctor.rating}</span>
                          <span className="text-gray-500 text-xs ml-1">
                            ({doctor.review_count})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{doctor.experience}</TableCell>
                      <TableCell>{doctor.price} ₽</TableCell>
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
                              onClick={() => openEditDialog(doctor)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(doctor)}
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
              <p className="text-gray-500">Врачи не найдены</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Doctor Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Добавить нового врача</DialogTitle>
            <DialogDescription>
              Заполните информацию о новом враче клиники
            </DialogDescription>
          </DialogHeader>

          <Formik
            initialValues={initialValues}
            validationSchema={DoctorValidationSchema}
            onSubmit={onAddSubmit}
          >
            {({ isSubmitting, values, setFieldValue, errors, touched }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormItem>
                      <FormLabel htmlFor="name">ФИО врача</FormLabel>
                      <Field
                        as={Input}
                        id="name"
                        name="name"
                        placeholder="Иванов Иван Иванович"
                      />
                      <ErrorMessage name="name" component={FormMessage} />
                    </FormItem>

                    <FormItem>
                      <FormLabel htmlFor="specialty">Специальность</FormLabel>
                      <Field
                        as={Input}
                        id="specialty"
                        name="specialty"
                        placeholder="Терапевт"
                      />
                      <ErrorMessage name="specialty" component={FormMessage} />
                    </FormItem>

                    <FormItem>
                      <FormLabel htmlFor="experience">Опыт работы</FormLabel>
                      <Field
                        as={Input}
                        id="experience"
                        name="experience"
                        placeholder="10 лет"
                      />
                      <ErrorMessage name="experience" component={FormMessage} />
                    </FormItem>

                    <FormItem>
                      <FormLabel htmlFor="education">Образование</FormLabel>
                      <Field
                        as={Textarea}
                        id="education"
                        name="education"
                        placeholder="Первый МГМУ им. И.М. Сеченова, 2010"
                      />
                      <ErrorMessage name="education" component={FormMessage} />
                    </FormItem>
                  </div>

                  <div className="space-y-4">
                    <FormItem>
                      <FormLabel>Фото</FormLabel>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          {photoPreview ? (
                            <img
                              src={photoPreview || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400">Нет фото</span>
                          )}
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                        />
                      </div>
                    </FormItem>

                    <FormItem>
                      <FormLabel htmlFor="languages">Языки</FormLabel>
                      <Field
                        as={Input}
                        id="languages"
                        name="languages"
                        placeholder="Русский, Английский"
                      />
                      <ErrorMessage name="languages" component={FormMessage} />
                    </FormItem>

                    <FormItem>
                      <FormLabel htmlFor="price">Стоимость приема</FormLabel>
                      <Field
                        as={Input}
                        id="price"
                        name="price"
                        placeholder="2000"
                      />
                      <ErrorMessage name="price" component={FormMessage} />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Принимает страховки</FormLabel>
                      <div className="space-y-2">
                        {["ОМС", "ДМС", "Согаз", "Ингосстрах", "Альфа"].map(
                          (insurance) => (
                            <div
                              key={insurance}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`insurance-${insurance}`}
                                checked={values.accepts_insurance?.includes(
                                  insurance
                                )}
                                onCheckedChange={(checked) => {
                                  const current =
                                    values.accepts_insurance || [];
                                  if (checked) {
                                    setFieldValue("accepts_insurance", [
                                      ...current,
                                      insurance,
                                    ]);
                                  } else {
                                    setFieldValue(
                                      "accepts_insurance",
                                      current.filter((i) => i !== insurance)
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={`insurance-${insurance}`}
                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {insurance}
                              </label>
                            </div>
                          )
                        )}
                      </div>
                    </FormItem>
                  </div>
                </div>

                <FormItem>
                  <FormLabel htmlFor="about">О враче</FormLabel>
                  <Field
                    as={Textarea}
                    id="about"
                    name="about"
                    placeholder="Информация о враче, опыте работы и специализации"
                    className="min-h-[120px]"
                  />
                  <ErrorMessage name="about" component={FormMessage} />
                </FormItem>

                <FormItem>
                  <FormLabel>Услуги</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {services?.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={values.services?.includes(
                            service.id.toString()
                          )}
                          onCheckedChange={(checked) => {
                            const current = values.services || [];
                            if (checked) {
                              setFieldValue("services", [
                                ...current,
                                service.id.toString(),
                              ]);
                            } else {
                              setFieldValue(
                                "services",
                                current.filter(
                                  (id) => id !== service.id.toString()
                                )
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={`service-${service.id}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {service.name} - {service.price} ₽
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.services && touched.services && (
                    <FormMessage>{errors.services}</FormMessage>
                  )}
                </FormItem>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || createDoctor.isPending}
                  >
                    {isSubmitting || createDoctor.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      "Добавить врача"
                    )}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Edit Doctor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать информацию о враче</DialogTitle>
            <DialogDescription>
              Измените информацию о враче клиники
            </DialogDescription>
          </DialogHeader>

          {selectedDoctor && (
            <Formik
              initialValues={{
                name: selectedDoctor.name,
                specialty: selectedDoctor.specialty,
                experience: selectedDoctor.experience,
                education: selectedDoctor.education.join(", "),
                languages: selectedDoctor.languages.join(", "),
                price: selectedDoctor.price,
                about: selectedDoctor.about,
                services: selectedDoctor.services.map((s) => s.id.toString()),
                accepts_insurance: selectedDoctor.accepts_insurance,
              }}
              validationSchema={DoctorValidationSchema}
              onSubmit={onEditSubmit}
            >
              {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormItem>
                        <FormLabel htmlFor="edit-name">ФИО врача</FormLabel>
                        <Field
                          as={Input}
                          id="edit-name"
                          name="name"
                          placeholder="Иванов Иван Иванович"
                        />
                        <ErrorMessage name="name" component={FormMessage} />
                      </FormItem>

                      <FormItem>
                        <FormLabel htmlFor="edit-specialty">
                          Специальность
                        </FormLabel>
                        <Field
                          as={Input}
                          id="edit-specialty"
                          name="specialty"
                          placeholder="Терапевт"
                        />
                        <ErrorMessage
                          name="specialty"
                          component={FormMessage}
                        />
                      </FormItem>

                      <FormItem>
                        <FormLabel htmlFor="edit-experience">
                          Опыт работы
                        </FormLabel>
                        <Field
                          as={Input}
                          id="edit-experience"
                          name="experience"
                          placeholder="10 лет"
                        />
                        <ErrorMessage
                          name="experience"
                          component={FormMessage}
                        />
                      </FormItem>

                      <FormItem>
                        <FormLabel htmlFor="edit-education">
                          Образование
                        </FormLabel>
                        <Field
                          as={Textarea}
                          id="edit-education"
                          name="education"
                          placeholder="Первый МГМУ им. И.М. Сеченова, 2010"
                        />
                        <ErrorMessage
                          name="education"
                          component={FormMessage}
                        />
                      </FormItem>
                    </div>

                    <div className="space-y-4">
                      <FormItem>
                        <FormLabel>Фото</FormLabel>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {photoPreview ? (
                              <img
                                src={photoPreview || "/placeholder.svg"}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-400">Нет фото</span>
                            )}
                          </div>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                          />
                        </div>
                      </FormItem>

                      <FormItem>
                        <FormLabel htmlFor="edit-languages">Языки</FormLabel>
                        <Field
                          as={Input}
                          id="edit-languages"
                          name="languages"
                          placeholder="Русский, Английский"
                        />
                        <ErrorMessage
                          name="languages"
                          component={FormMessage}
                        />
                      </FormItem>

                      <FormItem>
                        <FormLabel htmlFor="edit-price">
                          Стоимость приема
                        </FormLabel>
                        <Field
                          as={Input}
                          id="edit-price"
                          name="price"
                          placeholder="2000"
                        />
                        <ErrorMessage name="price" component={FormMessage} />
                      </FormItem>

                      <FormItem>
                        <FormLabel>Принимает страховки</FormLabel>
                        <div className="space-y-2">
                          {["ОМС", "ДМС", "Согаз", "Ингосстрах", "Альфа"].map(
                            (insurance) => (
                              <div
                                key={insurance}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`edit-insurance-${insurance}`}
                                  checked={values.accepts_insurance?.includes(
                                    insurance
                                  )}
                                  onCheckedChange={(checked) => {
                                    const current =
                                      values.accepts_insurance || [];
                                    if (checked) {
                                      setFieldValue("accepts_insurance", [
                                        ...current,
                                        insurance,
                                      ]);
                                    } else {
                                      setFieldValue(
                                        "accepts_insurance",
                                        current.filter((i) => i !== insurance)
                                      );
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`edit-insurance-${insurance}`}
                                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {insurance}
                                </label>
                              </div>
                            )
                          )}
                        </div>
                      </FormItem>
                    </div>
                  </div>

                  <FormItem>
                    <FormLabel htmlFor="edit-about">О враче</FormLabel>
                    <Field
                      as={Textarea}
                      id="edit-about"
                      name="about"
                      placeholder="Информация о враче, опыте работы и специализации"
                      className="min-h-[120px]"
                    />
                    <ErrorMessage name="about" component={FormMessage} />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Услуги</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {services?.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`edit-service-${service.id}`}
                            checked={values.services?.includes(
                              service.id.toString()
                            )}
                            onCheckedChange={(checked) => {
                              const current = values.services || [];
                              if (checked) {
                                setFieldValue("services", [
                                  ...current,
                                  service.id.toString(),
                                ]);
                              } else {
                                setFieldValue(
                                  "services",
                                  current.filter(
                                    (id) => id !== service.id.toString()
                                  )
                                );
                              }
                            }}
                          />
                          <label
                            htmlFor={`edit-service-${service.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {service.name} - {service.price} ₽
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.services && touched.services && (
                      <FormMessage>{errors.services}</FormMessage>
                    )}
                  </FormItem>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || updateDoctor.isPending}
                    >
                      {isSubmitting || updateDoctor.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        "Сохранить изменения"
                      )}
                    </Button>
                  </DialogFooter>
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Doctor Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить врача</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить врача {selectedDoctor?.name}? Это
              действие нельзя отменить.
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
              disabled={deleteDoctor.isPending}
            >
              {deleteDoctor.isPending ? (
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
