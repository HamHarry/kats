import { useState, useRef, useEffect, useCallback } from "react";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import { BookingStatus } from "../../model/booking.type";

dayjs.locale("th");

export interface BookingItem {
  status: BookingStatus;
  label: string;
}

export interface CustomCalendarProps {
  /** เหมือน generateCellDict เดิม — รับวันที่แล้วคืน array ของ bookings */
  cellRender: (date: Dayjs) => BookingItem[];
  /** callback เมื่อคลิก cell */
  onSelectDate?: (date: Dayjs) => void;
  /** วันที่ที่ถูก select อยู่ (controlled) */
  value?: Dayjs;
  /** default month/year ที่แสดง */
  defaultValue?: Dayjs;
}

// ─── Status → color map ───────────────────────────────
const STATUS_COLOR: Record<string, { dot: string; bg: string; text: string }> = {
  [BookingStatus.PENDING]: { dot: "#faad14", bg: "rgba(250,173,20,0.12)", text: "#b36a00" },
  [BookingStatus.CHECKING]: { dot: "#faad14", bg: "rgba(250,173,20,0.12)", text: "#b36a00" },
  [BookingStatus.PAID]: { dot: "#1677ff", bg: "rgba(22,119,255,0.10)", text: "#0044cc" },
  [BookingStatus.COMPLETED]: { dot: "#52c41a", bg: "rgba(82,196,26,0.10)", text: "#2d7a00" },
  [BookingStatus.CANCELED]: { dot: "#ff4d4f", bg: "rgba(255,77,79,0.10)", text: "#cc0002" },
};

const DEFAULT_COLOR = { dot: "#d9d9d9", bg: "rgba(0,0,0,0.04)", text: "#666" };

// ─── Tooltip ──────────────────────────────────────────
interface TooltipProps {
  items: BookingItem[];
  anchorRef: React.RefObject<HTMLElement | null>;
  visible: boolean;
}

function Tooltip({ items, anchorRef, visible }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [side, setSide] = useState<"bottom" | "top">("bottom");

  useEffect(() => {
    if (!visible || !anchorRef.current || !tooltipRef.current) return;
    const anchor = anchorRef.current.getBoundingClientRect();
    const tip = tooltipRef.current.getBoundingClientRect();
    const vp = { w: window.innerWidth, h: window.innerHeight };

    const spaceBelow = vp.h - anchor.bottom;
    const spaceAbove = anchor.top;
    const showAbove = spaceBelow < tip.height + 12 && spaceAbove > spaceBelow;

    let left = anchor.left + anchor.width / 2 - tip.width / 2;
    left = Math.max(8, Math.min(left, vp.w - tip.width - 8));

    const top = showAbove ? anchor.top - tip.height - 8 : anchor.bottom + 8;

    setSide(showAbove ? "top" : "bottom");
    setPos({ top: top + window.scrollY, left });
  }, [visible, anchorRef, items]);

  if (!visible || items.length === 0) return null;

  return (
    <div
      ref={tooltipRef}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        zIndex: 9999,
        background: "#fff",
        border: "1px solid rgba(0,150,100,0.2)",
        borderRadius: 12,
        padding: "10px 14px",
        boxShadow: "0 8px 32px rgba(0,80,50,0.15), 0 2px 8px rgba(0,0,0,0.08)",
        minWidth: 180,
        maxWidth: 260,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : side === "bottom" ? "translateY(-6px) scale(0.97)" : "translateY(6px) scale(0.97)",
        transition: "opacity 0.18s ease, transform 0.18s ease",
      }}
    >
      {/* Arrow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          ...(side === "bottom"
            ? { top: -7, borderBottom: "7px solid #fff", borderLeft: "7px solid transparent", borderRight: "7px solid transparent" }
            : { bottom: -7, borderTop: "7px solid #fff", borderLeft: "7px solid transparent", borderRight: "7px solid transparent" }),
          width: 0,
          height: 0,
          filter: "drop-shadow(0 -1px 1px rgba(0,150,100,0.15))",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item, i) => {
          const c = STATUS_COLOR[item.status] ?? DEFAULT_COLOR;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: c.bg,
                borderRadius: 8,
                padding: "4px 8px",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: c.dot,
                  flexShrink: 0,
                  boxShadow: `0 0 0 2px ${c.dot}33`,
                }}
              />
              <span
                style={{
                  fontSize: "0.82rem",
                  fontFamily: "Sarabun, sans-serif",
                  color: c.text,
                  fontWeight: 500,
                  lineHeight: 1.4,
                  wordBreak: "break-word",
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Calendar Cell ────────────────────────────────────
interface CellProps {
  date: Dayjs;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  items: BookingItem[];
  onClick: () => void;
}

function CalendarCell({ date, isCurrentMonth, isToday, isSelected, items, onClick }: CellProps) {
  const [hovered, setHovered] = useState(false);
  const cellRef = useRef<HTMLDivElement>(null);

  const MAX_VISIBLE = 2;
  const visible = items.slice(0, MAX_VISIBLE);
  const overflow = items.length - MAX_VISIBLE;

  return (
    <>
      <div
        ref={cellRef}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          height: 95,
          borderRadius: 10,
          border: isSelected ? "1.5px solid rgba(4,57,41,0.4)" : isToday ? "1.5px solid #043929" : "1px solid transparent",
          background: isSelected ? "rgba(4,57,41,0.06)" : hovered ? "#f5fdf8" : "transparent",
          padding: "6px 8px",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          transition: "background 0.15s, border-color 0.15s",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Date number */}
        <div
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 600,
            fontSize: "0.88rem",
            color: isCurrentMonth ? (isToday ? "#043929" : "#1a2e22") : "#c0d4cb",
            lineHeight: 1,
            marginBottom: 2,
          }}
        >
          {date.date()}
        </div>

        {/* Booking items (truncated) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2, overflow: "hidden", flex: 1 }}>
          {visible.map((item, i) => {
            const c = STATUS_COLOR[item.status] ?? DEFAULT_COLOR;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: c.dot,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontFamily: "Sarabun, sans-serif",
                    color: "#1a2e22",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.3,
                    maxWidth: "100%",
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}

          {/* +N more badge */}
          {overflow > 0 && (
            <div
              style={{
                fontSize: "0.7rem",
                fontFamily: "Sarabun, sans-serif",
                color: "#4a7a5e",
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              +{overflow} more
            </div>
          )}
        </div>
      </div>

      {/* Tooltip — portal-style, fixed position */}
      {items.length > 0 && <Tooltip items={items} anchorRef={cellRef} visible={hovered} />}
    </>
  );
}

// ─── Main Calendar ────────────────────────────────────
export default function CustomCalendar({ cellRender, onSelectDate, value, defaultValue }: CustomCalendarProps) {
  const [current, setCurrent] = useState<Dayjs>(value ?? defaultValue ?? dayjs());
  const [selected, setSelected] = useState<Dayjs | null>(value ?? null);

  // sync controlled value
  useEffect(() => {
    if (value) {
      setSelected(value);
      setCurrent(value);
    }
  }, [value]);

  const today = dayjs();
  const startOfMonth = current.startOf("month");
  const startDow = startOfMonth.day(); // 0=Sun

  // Build 6-week grid
  const cells: Dayjs[] = [];
  const gridStart = startOfMonth.subtract(startDow, "day");
  for (let i = 0; i < 42; i++) {
    cells.push(gridStart.add(i, "day"));
  }

  const DOW = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
  const MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

  const years = Array.from({ length: 10 }, (_, i) => current.year() - 5 + i);

  const handleSelect = useCallback(
    (date: Dayjs) => {
      setSelected(date);
      setCurrent(date);
      onSelectDate?.(date);
    },
    [onSelectDate],
  );

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(0,150,100,0.18)",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 2px 12px rgba(0,120,80,0.08)",
        fontFamily: "Sarabun, sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          paddingBottom: 16,
          borderBottom: "1px solid rgba(0,150,100,0.18)",
        }}
      >
        <button onClick={() => setCurrent((c) => c.subtract(1, "month"))} style={navBtnStyle}>
          ‹
        </button>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Month selector */}
          <select value={current.month()} onChange={(e) => setCurrent((c) => c.month(Number(e.target.value)))} style={selectStyle}>
            {MONTHS.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>

          {/* Year selector */}
          <select value={current.year()} onChange={(e) => setCurrent((c) => c.year(Number(e.target.value)))} style={selectStyle}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y + 543}
              </option>
            ))}
          </select>
        </div>

        <button onClick={() => setCurrent((c) => c.add(1, "month"))} style={navBtnStyle}>
          ›
        </button>
      </div>

      {/* ── Day-of-week headers ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
        {DOW.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 600,
              fontSize: "0.78rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#8ab5a0",
              padding: "6px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* ── Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map((date, i) => {
          const isCurrentMonth = date.month() === current.month();
          const isToday = date.isSame(today, "day");
          const isSelected = selected ? date.isSame(selected, "day") : false;
          const items = isCurrentMonth ? cellRender(date) : [];

          return <CalendarCell key={i} date={date} isCurrentMonth={isCurrentMonth} isToday={isToday} isSelected={isSelected} items={items} onClick={() => handleSelect(date)} />;
        })}
      </div>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────
const navBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(0,150,100,0.2)",
  borderRadius: 8,
  width: 36,
  height: 36,
  cursor: "pointer",
  fontSize: "1.3rem",
  color: "#1a3d28",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.15s",
  lineHeight: 1,
};

const selectStyle: React.CSSProperties = {
  border: "1px solid rgba(0,150,100,0.25)",
  borderRadius: 8,
  padding: "4px 10px",
  fontFamily: "Rajdhani, sans-serif",
  fontWeight: 600,
  fontSize: "0.95rem",
  color: "#1a3d28",
  background: "#fff",
  cursor: "pointer",
  outline: "none",
};
