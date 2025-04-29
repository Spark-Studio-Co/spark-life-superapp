"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Moon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { apiClient } from "@/shared/api/apiClient";

interface Props {
  initialHours: number;
  goalHours: number;
  onUpdate?: () => void;
}

export function SleepCircleIndicator({ initialHours, goalHours, onUpdate }: Props) {
  const [hours, setHours] = useState(initialHours);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const percentage = Math.min((hours / goalHours) * 100, 100);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Local storage keys
  const SLEEP_STORAGE_KEY = 'spark-life-sleep';
  const SLEEP_DATE_KEY = 'spark-life-sleep-date';
  
  // Check if data was already sent today when component mounts
  useEffect(() => {
    const loadFromLocalStorage = () => {
      try {
        // Check if we have data saved for today
        const savedDate = localStorage.getItem(SLEEP_DATE_KEY);
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        
        if (savedDate === today) {
          // We have data for today, load it
          const savedHours = localStorage.getItem(SLEEP_STORAGE_KEY);
          
          if (savedHours) {
            setHours(Number(savedHours));
          }
          
          console.log('Loaded sleep data from local storage:', {
            hours: savedHours,
            date: savedDate
          });
          
          return true; // Data was loaded from local storage
        }
        
        return false; // No data for today in local storage
      } catch (error) {
        console.error('Error loading from local storage:', error);
        return false;
      }
    };
    
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // First get user data
        const userResponse = await apiClient.get('/user/me');
        console.log('User data:', userResponse.data);
        
        // Also try to get AI-based recommendations
        try {
          await apiClient.get('/user/ai-stats');
          // We're not using the response yet, but we might need it in the future
        } catch (aiError) {
          console.error('Error fetching AI recommendations:', aiError);
        }
        
        // Then check weekly statistics
        const statsResponse = await apiClient.post('/user/weekly-statistic');
        
        // If sleep data exists for today, update the component
        if (statsResponse.data && statsResponse.data.sleep) {
          setHours(statsResponse.data.sleep); // Update hours to match server data
          
          // Save to local storage
          localStorage.setItem(SLEEP_STORAGE_KEY, statsResponse.data.sleep.toString());
          localStorage.setItem(SLEEP_DATE_KEY, new Date().toISOString().split('T')[0]);
        }
      } catch (error) {
        console.error('Error fetching user data or sleep status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // First try to load from local storage, if not successful, fetch from API
    const dataLoaded = loadFromLocalStorage();
    if (!dataLoaded) {
      fetchUserData();
    }
  }, []);

  const moonCount = 8;
  const angleStep = 360 / moonCount;

  // Function to send data to API
  const sendSleepData = async () => {
    try {
      setIsLoading(true);
      await apiClient.post('/user/weekly-statistic', { sleep: hours });
      console.log(`Updated sleep statistics to ${hours} hours`);
      setIsSaved(true);
      
      // Save to local storage
      localStorage.setItem(SLEEP_STORAGE_KEY, hours.toString());
      localStorage.setItem(SLEEP_DATE_KEY, new Date().toISOString().split('T')[0]);
      
      // Keep the saved state visible for a moment
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
      
      // Call the refetch callback if provided
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error saving sleep data:', error);
      setIsSaved(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Track last sent value to avoid duplicate requests
  const lastSentValueRef = useRef(initialHours);

  // Setup debounce effect
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only set up debounce if hours have changed from last sent value
    if (hours !== lastSentValueRef.current && hours > 0) {
      setIsSaved(false);
      debounceTimerRef.current = setTimeout(() => {
        sendSleepData();
        lastSentValueRef.current = hours; // Update last sent value
      }, 5000); // 5 seconds debounce
    }

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [hours, onUpdate]);

  const addHour = () => {
    // Ensure values are numbers
    const currentHours = isNaN(hours) ? 0 : Number(hours);
    const targetGoal = isNaN(goalHours) ? 8 : Number(goalHours);
    
    // Update local state
    const newHours = Math.min(currentHours + 1, targetGoal);
    console.log('Adding hour:', { currentHours, newHours });
    
    setHours(newHours);
    
    // Save to local storage immediately for a responsive feel
    localStorage.setItem(SLEEP_STORAGE_KEY, newHours.toString());
    localStorage.setItem(SLEEP_DATE_KEY, new Date().toISOString().split('T')[0]);
  };

  const reset = () => {
    setHours(0);
    
    // Update local storage
    localStorage.setItem(SLEEP_STORAGE_KEY, '0');
    localStorage.setItem(SLEEP_DATE_KEY, new Date().toISOString().split('T')[0]);
    
    console.log('Sleep hours reset to 0');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl px-6 py-8 w-full transition-all duration-300 hover:shadow-2xl">
      <h3 className="text-center text-lg font-semibold text-purple-600 mb-4">🌙 Трекер сна</h3>

      <div className="relative w-56 h-56 mx-auto">
        {/* Маленькие луны по кругу */}
        {[...Array(moonCount)].map((_, i) => {
          const angle = i * angleStep - 90; // смещение на -90 чтобы начать сверху
          const radius = 100; // чуть меньше чтобы иконки не выходили
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);

          return (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0 }}
              animate={{ opacity: percentage >= (i / moonCount) * 100 ? 1 : 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              style={{
                top: `calc(50% + ${y}px - 8px)`,
                left: `calc(50% + ${x}px - 8px)`,
                transform: `rotate(${angle + 90}deg)`, // поворот в нужную сторону
              }}
            >
              <Moon className={`w-4 h-4 ${percentage >= (i / moonCount) * 100 ? 'text-purple-500' : 'text-purple-200'}`} />
            </motion.div>
          );
        })}

        {/* Прогресс */}
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 280 280">
          <circle
            cx="140"
            cy="140"
            r="90"
            stroke="#E5E7EB"
            strokeWidth="12"
            fill="none"
          />
          <motion.circle
            cx="140"
            cy="140"
            r="90"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 90}
            strokeDashoffset={(1 - percentage / 100) * 2 * Math.PI * 90}
            initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
            animate={{ strokeDashoffset: (1 - percentage / 100) * 2 * Math.PI * 90 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            transform="rotate(-90 140 140)"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Часы */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.p
            className="text-4xl font-bold text-gray-800"
            key={hours} // Для анимации при изменении
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isNaN(hours) ? '0' : hours}
          </motion.p>
          <p className="text-gray-500 text-sm">/ {isNaN(goalHours) ? '8' : goalHours} ч</p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          onClick={addHour}
          className="flex-1 bg-purple-600 hover:bg-purple-700 transition-all duration-300"
          disabled={hours >= goalHours || isLoading}
        >
          {isLoading ? 'Сохранение...' : 
           isSaved ? '✓ Сохранено' : 
           <>
             <Plus className="h-4 w-4 mr-2" />
             Добавить 1ч
           </>}
        </Button>
        <Button
          variant="outline"
          onClick={reset}
          className="w-12 p-0 border-purple-200 text-purple-500 hover:bg-purple-50 transition-all duration-300"
          disabled={hours === 0 || isLoading}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}