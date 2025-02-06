import "./CalendarAdminPage.css";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format } from "date-fns";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";

const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarAdminPage = () => {
  return (
    <div className="container-calendarAdmin">
      <div className="header-calendarAdmin">
        <h1>Calendar</h1>
      </div>
      <div className="calendar-Admin">
        <div className="wrap-calendar">
          <Calendar
            localizer={localizer}
            events={[]}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 520, width: 1250 }}
          />
        </div>
      </div>
      <div className="btn-calendarAdmin">
        <button type="submit" className="btn-submit-calendarAdmin">
          ยืนยัน
        </button>
        <button className="btn-edit-calendarAdmin">แก้ไข</button>
      </div>
    </div>
  );
};

export default CalendarAdminPage;
