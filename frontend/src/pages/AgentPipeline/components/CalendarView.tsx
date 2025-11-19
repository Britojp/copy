import { useMemo, useState, useEffect } from 'react';
import { Info, ChevronLeft, ChevronRight } from 'lucide-react';

type CalendarViewProps = {
  startDate: string;
  endDate: string;
  events: Array<{ data?: string; nome?: string; [key: string]: any }>;
  onDateClick?: (event: any) => void;
};

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function CalendarView({ startDate, endDate, events, onDateClick }: CalendarViewProps) {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  
  const { calendarMonths, eventsByDate } = useMemo(() => {
    if (!startDate || !endDate) {
      return { calendarMonths: [], eventsByDate: new Map() };
    }

    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T23:59:59');
    const eventsMap = new Map<string, any[]>();

    events.forEach((event) => {
      if (event.data) {
        const eventDateStr = event.data.split('T')[0];
        if (!eventsMap.has(eventDateStr)) {
          eventsMap.set(eventDateStr, []);
        }
        eventsMap.get(eventDateStr)!.push(event);
      }
    });

    const monthsMap = new Map<string, { month: number; year: number; start: Date; end: Date }>();
    
    const current = new Date(start);
    while (current <= end) {
      const monthKey = `${current.getFullYear()}-${current.getMonth()}`;
      if (!monthsMap.has(monthKey)) {
        monthsMap.set(monthKey, {
          month: current.getMonth(),
          year: current.getFullYear(),
          start: new Date(current),
          end: new Date(current),
        });
      } else {
        const monthData = monthsMap.get(monthKey)!;
        monthData.end = new Date(current);
      }
      current.setDate(current.getDate() + 1);
    }

    const calendarMonths: Array<{ month: string; year: number; monthNum: number; start: Date; end: Date }> = [];
    monthsMap.forEach((monthData) => {
      calendarMonths.push({
        month: months[monthData.month],
        year: monthData.year,
        monthNum: monthData.month,
        start: monthData.start,
        end: monthData.end,
      });
    });

    calendarMonths.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.monthNum - b.monthNum;
    });

    return { calendarMonths, eventsByDate: eventsMap };
  }, [startDate, endDate, events]);

  useEffect(() => {
    setCurrentMonthIndex(0);
  }, [startDate, endDate]);

  const currentMonth = calendarMonths[currentMonthIndex];
  const hasPreviousMonth = currentMonthIndex > 0;
  const hasNextMonth = currentMonthIndex < calendarMonths.length - 1;

  const goToPreviousMonth = () => {
    if (hasPreviousMonth) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const goToNextMonth = () => {
    if (hasNextMonth) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  if (!startDate || !endDate) {
    return (
      <div className="text-xs text-muted-foreground">
        Defina as datas inicial e final nos parâmetros para visualizar o calendário.
      </div>
    );
  }

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isDateInRange = (date: Date) => {
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T23:59:59');
    return date >= start && date <= end;
  };

  if (!currentMonth) {
    return (
      <div className="text-xs text-muted-foreground">
        Nenhum mês disponível no intervalo selecionado.
      </div>
    );
  }

  const { month, year, monthNum, start, end } = currentMonth;
  const monthStart = new Date(year, monthNum, 1);
  const firstDayOfWeek = monthStart.getDay();
  const daysInMonth = new Date(year, monthNum + 1, 0).getDate();
  const rangeStartDay = start.getDate();
  const rangeEndDay = end.getDate();
  const rangeStartMonth = start.getMonth();
  const rangeEndMonth = end.getMonth();

  const displayDays: Array<Date | null> = [];
  
  for (let i = 0; i < firstDayOfWeek; i++) {
    displayDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthNum, day);
    displayDays.push(date);
  }

  const remainingCells = 7 - (displayDays.length % 7);
  if (remainingCells < 7) {
    for (let i = 0; i < remainingCells; i++) {
      displayDays.push(null);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={goToPreviousMonth}
          disabled={!hasPreviousMonth}
          className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Mês anterior"
        >
          <ChevronLeft size={14} />
        </button>
        <h3 className="text-xs font-medium" style={{ fontFamily: 'var(--font-logo)' }}>
          {month} {year}
        </h3>
        <button
          onClick={goToNextMonth}
          disabled={!hasNextMonth}
          className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Próximo mês"
        >
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {weekDays.map((day) => (
          <div key={day} className="text-[9px] text-muted-foreground text-center font-medium py-0.5">
            {day}
          </div>
        ))}
        {displayDays.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const dateKey = formatDateKey(day);
          const dayEvents = eventsByDate.get(dateKey) || [];
          const hasEvents = dayEvents.length > 0;
          const inRange = isDateInRange(day);
          const isInMonthRange = 
            (monthNum === rangeStartMonth && day.getDate() >= rangeStartDay) ||
            (monthNum === rangeEndMonth && day.getDate() <= rangeEndDay) ||
            (monthNum > rangeStartMonth && monthNum < rangeEndMonth);

          const formatFullDate = () => {
            return `${day.getDate()} de ${months[day.getMonth()]} de ${day.getFullYear()}`;
          };

          const getDayDetails = () => {
            const details: string[] = [];
            details.push(formatFullDate());
            if (hasEvents) {
              details.push(`${dayEvents.length} evento${dayEvents.length > 1 ? 's' : ''}`);
              dayEvents.forEach((event: any) => {
                if (event.nome) details.push(`${event.nome}`);
                if (event.descricao) details.push(`  ${event.descricao}`);
              });
            } else {
              details.push('Sem eventos');
            }
            return details.join('\n');
          };

          const firstEventName = hasEvents ? (dayEvents[0]?.nome || 'Evento') : null;

          return (
            <div key={dateKey} className="relative group">
              <button
                onClick={() => hasEvents && onDateClick && onDateClick(dayEvents[0])}
                disabled={!hasEvents || !inRange}
                className={`
                  aspect-square rounded-md p-1 flex flex-col items-start justify-between relative
                  transition-all duration-200 w-full min-h-0 overflow-hidden
                  ${!inRange ? 'opacity-30' : ''}
                  ${hasEvents
                    ? 'bg-primary/15 hover:bg-primary/25 cursor-pointer shadow-sm hover:shadow'
                    : inRange && isInMonthRange
                    ? 'bg-muted/20 hover:bg-muted/30'
                    : 'bg-transparent'
                  }
                `}
              >
                <div className="flex items-center justify-between w-full mb-0.5">
                  <span className={`
                    font-semibold leading-none
                    ${hasEvents ? 'text-primary text-[12px]' : 'text-foreground text-[12px]'}
                    ${!inRange ? 'text-muted-foreground/50' : ''}
                  `}>
                    {day.getDate()}
                  </span>
                  {hasEvents && dayEvents.length > 1 && (
                    <span className="text-[12px] font-medium px-0.5 py-0 rounded bg-primary/20 text-primary leading-none">
                      +{dayEvents.length - 1}
                    </span>
                  )}
                  <Info 
                    size={8} 
                    className={`
                      opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0
                      ${hasEvents ? 'text-primary' : 'text-muted-foreground'}
                    `}
                  />
                </div>
                
                {firstEventName && (
                  <div className="w-full flex-1 flex items-start min-h-0">
                    <span className={`
                      text-[9px] leading-tight line-clamp-2 break-words w-full text-left
                      ${hasEvents ? 'text-primary font-medium' : 'text-muted-foreground'}
                      ${!inRange ? 'text-muted-foreground/50' : ''}
                    `}>
                      {firstEventName}
                    </span>
                  </div>
                )}
                
                {!hasEvents && inRange && isInMonthRange && (
                  <div className="w-full h-0.5 bg-muted/40 rounded-full"></div>
                )}
              </button>
              <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-popover text-popover-foreground text-[10px] rounded-md shadow-lg border border-border whitespace-pre-line max-w-[400px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                {getDayDetails()}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

