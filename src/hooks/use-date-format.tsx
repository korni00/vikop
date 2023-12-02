// useDateFormat.ts
import { useEffect, useState } from "react";

interface DateFormatOptions {
  hour12?: boolean;
}

const useDateFormat = (date: Date, options?: DateFormatOptions) => {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    const currentDate = new Date();
    const isToday =
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear();

    const isYesterday = (d: Date) => {
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);

      return (
        d.getDate() === yesterday.getDate() &&
        d.getMonth() === yesterday.getMonth() &&
        d.getFullYear() === yesterday.getFullYear()
      );
    };

    setFormattedDate(() => {
      if (isToday) {
        return `Today at ${date.toLocaleTimeString([], {
          hour: "numeric",
          minute: "numeric",
          hour12: options?.hour12,
        })}`;
      } else if (isYesterday(date)) {
        return `Yesterday at ${date.toLocaleTimeString([], {
          hour: "numeric",
          minute: "numeric",
          hour12: options?.hour12,
        })}`;
      } else {
        return date.toLocaleString(undefined, {
          weekday: "short",
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: options?.hour12,
        });
      }
    });
  }, [date, options]);

  return formattedDate;
};

export default useDateFormat;
