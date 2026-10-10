type TimestampInput = number | string | Date;

const WEEKDAYS_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

/**
 * Форматирует timestamp:
 * - < 24 часов → ЧЧ:ММ
 * - в текущей неделе → краткое название дня (Пн, Вт...)
 * - иначе → ДД.ММ.ГГГГ
 */
export const formatSmartDate = (timestamp: TimestampInput): string => {
  const date = new Date(timestamp);

  if (isNaN(date.getTime())) {
    return 'Некорректная дата';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const MS_IN_DAY = 24 * 60 * 60 * 1000;

  // Форматирование времени ЧЧ:ММ
  const formatTime = (d: Date): string => {
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Форматирование даты ДД.ММ.ГГГГ
  const formatDate = (d: Date): string => {
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // 1. Если прошло меньше 24 часов — показываем время
  if (diffMs >= 0 && diffMs < MS_IN_DAY) {
    return formatTime(date);
  }

  // 2. Проверяем, попадает ли дата в текущую неделю (Пн–Вс)
  // Находим понедельник текущей недели
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayOfWeekToday = now.getDay(); // 0 = Вс, 1 = Пн, ...
  // Смещение до понедельника: если воскресенье (0), то -6, иначе -(day - 1)
  const offsetToMonday = dayOfWeekToday === 0 ? -6 : -(dayOfWeekToday - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() + offsetToMonday);

  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  // Дата должна быть >= начала текущей недели и <= сегодня (но сегодня уже обработано выше)
  if (startOfDate.getTime() >= startOfWeek.getTime()) {
    return WEEKDAYS_SHORT[date.getDay()];
  }

  // 3. Всё остальное — полная дата
  return formatDate(date);
};

const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

/**
 * Форматирует дату:
 * - Если год текущий → "24 октября"
 * - Если год другой → "24 октября, 2025"
 */
export const formatDateWithMonth = (timestamp: TimestampInput): string => {
  const date = new Date(timestamp);

  if (isNaN(date.getTime())) {
    return 'Некорректная дата';
  }

  const currentYear = new Date().getFullYear();
  const dateYear = date.getFullYear();
  const day = date.getDate(); 
  const month = MONTHS_GENITIVE[date.getMonth()];

  if (dateYear === currentYear) {
    return `${day} ${month}`;
  }

  return `${day} ${month}, ${dateYear}`;
};

export const formatTime = (timestamp: TimestampInput): string => {
  const date = new Date(timestamp);

  if (isNaN(date.getTime())) {
    return '--:--';
  }

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
};