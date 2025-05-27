import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";
import {
  useGetAvailableTablesQuery,
  useCreateReservationMutation,
} from "../features/tableAvailabilityApiSlice";

import TableMap from "../components/TableMap";


export default function TablePage() {
  const [date, setDate] = useState(null);
  const [shift, setShift] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const dateString = date
    ? `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
    : null;

  const {
    data: tables = [],
    isLoading,
    isError,
  } = useGetAvailableTablesQuery(
    date && shift ? { date: dateString, timeSlot: shift } : skipToken
  );

  const [createReservation] = useCreateReservationMutation();

  const handleReserve = async () => {
    if (!selectedTable) return;
    try {
      await createReservation({
        userId: user._id,
        tableId: selectedTable,
        date: dateString,
        timeSlot: shift,
      }).unwrap();
      alert("השולחן הוזמן בהצלחה!");
      navigate("/payment");
    } catch (err) {
      alert(err?.data?.message || "שגיאה בהזמנה");
    }
  };

  return (
    <div className="p-6 grid md:grid-cols-2 gap-8">

      {/* צד שמאל: תאריך ומשמרת */}
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-xl font-semibold text-gray-800">בחר תאריך</h2>
        <Calendar
          value={date}
          onChange={(e) => setDate(e.value)}
          inline
          showWeek
          minDate={new Date()}
          maxDate={new Date(new Date().setDate(new Date().getDate() + 14))}
        />
        <div className="flex gap-3 flex-wrap justify-center">
          {["morning", "afternoon", "evening"].map((slot) => (
            <Button
              key={slot}
              label={
                slot === "morning"
                  ? "בוקר"
                  : slot === "afternoon"
                    ? "צהריים"
                    : "ערב"
              }
              severity={shift === slot ? "success" : "secondary"}
              onClick={() => setShift(slot)}
            />
          ))}
        </div>
      </div>

      {/* צד ימין: מפת שולחנות */}
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">בחר שולחן פנוי:</h2>

        {isLoading && <p>🔄 טוען שולחנות...</p>}
        {isError && <p className="text-red-500">❌ שגיאה בטעינת שולחנות</p>}

        <TableMap
          tables={tables}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
        />

        {/* כפתור הזמנה */}
        {selectedTable && (
          <div className="mt-8 text-center">
            <Button
              label='הזמן שולחן (20 ש"ח)'
              icon='pi pi-credit-card'
              onClick={handleReserve}
              severity='success'
              className="px-6 py-3 text-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
