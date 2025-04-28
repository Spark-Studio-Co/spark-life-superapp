//@ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  Calendar,
  Award,
  Languages,
  CreditCard,
  MapPin,
  Phone,
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { doctorsData } from "@/pages/clinics/model/doctors-data";
import { clinicsData } from "@/pages/doctor/model/clinics-data";
import { reviewsData } from "@/pages/doctor/model/reviews-data";
import { DoctorCard } from "@/entities/doctor/ui/doctor-card";
import { MainLayout } from "@/shared/ui/layout";

// Типы для отзывов
interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  date: string;
  rating: number;
  text: string;
  likes: number;
  dislikes: number;
  doctorResponse?: string;
}

// Компонент отзыва
const ReviewItem = ({ review }: { review: Review }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(review.likes);
  const [dislikesCount, setDislikesCount] = useState(review.dislikes);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount(likesCount - 1);
    } else {
      setLiked(true);
      setLikesCount(likesCount + 1);
      if (disliked) {
        setDisliked(false);
        setDislikesCount(dislikesCount - 1);
      }
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
      setDislikesCount(dislikesCount - 1);
    } else {
      setDisliked(true);
      setDislikesCount(dislikesCount + 1);
      if (liked) {
        setLiked(false);
        setLikesCount(likesCount - 1);
      }
    }
  };

  return (
    <div className="border border-gray-100 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <img
              src={review.authorAvatar || "/placeholder.svg"}
              alt={review.authorName}
            />
          </Avatar>
          <div>
            <h4 className="font-medium">{review.authorName}</h4>
            <p className="text-sm text-gray-500">{review.date}</p>
          </div>
        </div>
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.rating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-gray-700 mb-4">{review.text}</p>

      {review.doctorResponse && (
        <div className="bg-blue-50 rounded-lg p-3 mb-3">
          <div className="flex items-center mb-2">
            <MessageCircle className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-700">
              Ответ врача
            </span>
          </div>
          <p className="text-sm text-gray-700">{review.doctorResponse}</p>
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-500">
          <span>Отзыв был полезен?</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center ${
              liked ? "text-green-600" : "text-gray-500"
            } hover:text-green-600`}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{likesCount}</span>
          </button>
          <button
            onClick={handleDislike}
            className={`flex items-center ${
              disliked ? "text-red-600" : "text-gray-500"
            } hover:text-red-600`}
          >
            <ThumbsDown className="h-4 w-4 mr-1" />
            <span>{dislikesCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Компонент рейтинга
const RatingBreakdown = ({ reviews }: { reviews: Review[] }) => {
  const totalReviews = reviews.length;
  const ratingCounts = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 звезды

  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[5 - review.rating]++;
    }
  });

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) /
    (totalReviews || 1);

  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <div className="text-4xl font-bold mr-4">
          {averageRating.toFixed(1)}
        </div>
        <div>
          <div className="flex mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(averageRating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">{totalReviews} отзывов</p>
        </div>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating, index) => (
          <div key={rating} className="flex items-center">
            <span className="w-8 text-sm text-gray-600">{rating}</span>
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-2" />
            <Progress
              value={(ratingCounts[5 - rating] / totalReviews) * 100}
              className="h-2 flex-1"
            />
            <span className="w-10 text-right text-sm text-gray-600">
              {ratingCounts[5 - rating]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Компонент страницы врача
export function DoctorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Находим врача по ID
  const doctor = doctorsData.find((doc) => doc.id === id);

  // Если врач не найден, перенаправляем на страницу клиник
  useEffect(() => {
    if (!doctor) {
      navigate("/clinics");
    }
  }, [doctor, navigate]);

  if (!doctor) {
    return null;
  }

  // Находим клинику, в которой работает врач
  const clinic = clinicsData.find(
    (clinic: any) => clinic.id === doctor.clinicId
  );

  // Находим отзывы для этого врача
  const doctorReviews = reviewsData.filter(
    (review: any) => review.doctorId === doctor.id
  );

  // Находим похожих врачей (той же специальности)
  const similarDoctors = doctorsData
    .filter(
      (doc: any) => doc.specialty === doctor.specialty && doc.id !== doctor.id
    )
    .slice(0, 3);

  // Даты для записи (следующие 7 дней)
  const appointmentDates = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      value: date.toISOString().split("T")[0],
      label:
        index === 0
          ? "Сегодня"
          : index === 1
          ? "Завтра"
          : new Intl.DateTimeFormat("ru", {
              weekday: "short",
              day: "numeric",
              month: "short",
            }).format(date),
    };
  });

  // В��еменные слоты для записи
  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  return (
    <MainLayout>
      {/* Шапка с градиентом */}
      <div className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] px-4 pt-6 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white mb-4 hover:bg-blue-500/20 rounded-lg px-2 py-1"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Назад</span>
        </button>
        <h1 className="text-2xl font-bold text-white">{doctor.name}</h1>
        <p className="text-blue-100">{doctor.specialty}</p>
      </div>

      <div className="px-4 py-4">
        {/* Основная информация о враче */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4">
            <div className="flex items-start">
              <div className="w-24 h-24 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                <img
                  src={doctor.photo || "/placeholder.svg"}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 text-sm font-medium">
                      {doctor.rating}
                    </span>
                  </div>
                  <span className="mx-1 text-sm text-gray-500">
                    ({doctor.reviewCount} отзывов)
                  </span>
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <Award className="h-4 w-4 mr-1 text-gray-400" />
                  <span>Стаж {doctor.experience}</span>
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{doctor.schedule.hours}</span>
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{doctor.schedule.days.join(", ")}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <div>
                <span className="text-sm text-gray-500">Стоимость приема</span>
                <p className="font-semibold text-gray-900">{doctor.price}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Heart className="h-5 w-5 text-gray-600" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="h-5 w-5 text-gray-600" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Записаться
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Запись на прием</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                          <img
                            src={doctor.photo || "/placeholder.svg"}
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{doctor.name}</h3>
                          <p className="text-sm text-blue-600">
                            {doctor.specialty}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Выберите дату
                          </h4>
                          <div className="flex overflow-x-auto pb-2 space-x-2">
                            {appointmentDates.map((date) => (
                              <Button
                                key={date.value}
                                variant={
                                  selectedDate === date.value
                                    ? "default"
                                    : "outline"
                                }
                                className={`${
                                  selectedDate === date.value
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : ""
                                } whitespace-nowrap`}
                                size="sm"
                                onClick={() => setSelectedDate(date.value)}
                              >
                                {date.label}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {selectedDate && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">
                              Выберите время
                            </h4>
                            <div className="grid grid-cols-4 gap-2">
                              {timeSlots.map((time) => (
                                <Button
                                  key={time}
                                  variant={
                                    selectedTime === time
                                      ? "default"
                                      : "outline"
                                  }
                                  className={
                                    selectedTime === time
                                      ? "bg-blue-600 hover:bg-blue-700"
                                      : ""
                                  }
                                  size="sm"
                                  onClick={() => setSelectedTime(time)}
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedDate && selectedTime && (
                          <div className="mt-4">
                            <div className="bg-blue-50 p-3 rounded-lg mb-4">
                              <div className="flex items-center mb-1">
                                <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                                <span className="text-sm font-medium">
                                  {
                                    appointmentDates.find(
                                      (d) => d.value === selectedDate
                                    )?.label
                                  }
                                  , {selectedTime}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                                <span className="text-sm">
                                  {clinic?.name}, {clinic?.address}
                                </span>
                              </div>
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                              Подтвердить запись
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Клиника */}
        {clinic && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3">Клиника</h3>
              <div className="flex items-start">
                <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                  <img
                    src={clinic.image || "/placeholder.svg"}
                    alt={clinic.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{clinic.name}</h4>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{clinic.address}</span>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-1" />
                    <span>{clinic.phone}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-blue-600"
                onClick={() => navigate(`/clinics`)}
              >
                Подробнее о клинике
              </Button>
            </div>
          </div>
        )}

        {/* Вкладки с информацией */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">О враче</TabsTrigger>
            <TabsTrigger value="reviews">
              Отзывы
              <Badge variant="secondary" className="ml-2">
                {doctorReviews.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="similar">Похожие</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">О враче</h3>
                <p className="text-gray-700">{doctor.about}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Образование</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {doctor.education.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Дополнительная информация</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <Languages className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Языки</p>
                      <p>{doctor.languages.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Принимает страховки
                      </p>
                      <p>{doctor.acceptsInsurance.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="pt-4">
            <RatingBreakdown reviews={doctorReviews} />

            <div className="mb-4">
              <Button className="w-full">Оставить отзыв</Button>
            </div>

            {doctorReviews.length > 0 ? (
              <div>
                {doctorReviews.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-lg text-gray-500">Отзывов пока нет</p>
                <p className="text-sm text-gray-500">
                  Будьте первым, кто оставит отзыв
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="similar" className="pt-4">
            {similarDoctors.length > 0 ? (
              <div>
                <h3 className="font-medium mb-3">Похожие специалисты</h3>
                {similarDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="mb-4 cursor-pointer"
                    onClick={() => navigate(`/doctor/${doc.id}`)}
                  >
                    <DoctorCard doctor={doc} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Похожих специалистов не найдено</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
