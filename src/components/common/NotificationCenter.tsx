"use client";

import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserNotificationsAction } from "@/actions/cms.actions";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date | string;
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await getUserNotificationsAction("demo_candidate_id");
        if (res.success && res.data) {
          setNotifications(res.data as NotificationItem[]);
        }
      } catch {
        setNotifications([
          {
            id: "n1",
            title: "Document Verified",
            message: "Your passport copy has been verified by Ghazi Admin.",
            type: "success",
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: "n2",
            title: "Interview Scheduled",
            message: "Your interview for Heavy Duty Driver position is set for next Monday.",
            type: "info",
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    }
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setOpen(!open)}
        className="relative h-9 w-9 p-0 text-slate-700 hover:bg-[#F8FAF8] rounded-xl"
      >
        <Bell className="h-5 w-5 text-[#167A3D]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#D7E8D8] bg-white p-4 shadow-2xl z-50 animate-in fade-in space-y-3">
          <div className="flex items-center justify-between border-b border-[#D7E8D8] pb-2">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#167A3D]" /> Notifications
            </h4>
            <span className="text-[10px] font-bold bg-emerald-100 text-[#167A3D] px-2 py-0.5 rounded-full">
              {unreadCount} New
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-slate-500 font-medium">No notifications.</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{n.title}</span>
                    <span className="text-[9px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{n.message}</p>
                </div>
              ))
            )}
          </div>

          <Button
            size="sm"
            onClick={() => {
              setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
              setOpen(false);
            }}
            className="w-full text-xs bg-[#167A3D] text-white font-bold h-8 rounded-xl"
          >
            Mark All as Read
          </Button>
        </div>
      )}
    </div>
  );
}
