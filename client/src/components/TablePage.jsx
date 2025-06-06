import React, { useState, useRef } from "react";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useSelector, useDispatch } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';

import {
  useGetAvailableTablesQuery,
  useCreateReservationMutation,
} from "../features/tableAvailabilityApiSlice";
import TableMap from "../components/TableMap";
import { addOrder } from "../features/orderSlice";

import '../css/tableMap.css';

export default function TablePage() {
  const dispatch = useDispatch();
  const toast = useRef(null);

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
      const object = await createReservation({
        userId: user._id,
        tableId: selectedTable,
        date: dateString,
        timeSlot: shift,
      }).unwrap();

      dispatch(addOrder(object));
      toast.current.show({
        severity: 'success',
        summary: 'הזמנה בוצעה',
        detail: 'השולחן הוזמן בהצלחה!',
        life: 3000
      });

    } catch (err) {
      alert(err?.data?.message || "שגיאה בהזמנה");
    }
  };

  return (
    <div className="table-page">
      <Toast ref={toast} />

      <div className="table-left">
        <h2 className="text-xl font-semibold text-gray-800">בחר תאריך</h2>
        <div className="calendar-wrapper">
          <Calendar
            value={date}
            onChange={(e) => setDate(e.value)}
            inline
            showWeek
            rtl
            minDate={new Date()}
            maxDate={new Date(new Date().setDate(new Date().getDate() + 14))}
          />
        </div>

        <div className="shift-buttons">
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

      <div className="divider"></div>

      <div className="table-right">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">בחר שולחן פנוי:</h2>

        {isLoading && <p>🔄 טוען שולחנות...</p>}
        {isError && <p className="text-red-500">❌ שגיאה בטעינת שולחנות</p>}

        <TableMap
          tables={tables}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
        />

        {selectedTable && (
          <div className="mt-4 text-center">
            <Button
              label='הזמן שולחן (20 ש"ח)'
              icon='pi pi-credit-card'
              onClick={handleReserve}
              severity='success'
              className="p-button-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
