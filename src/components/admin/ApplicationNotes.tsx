"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addApplicationNoteAction } from "@/actions/application.actions";
import { MessageSquare, Plus, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NoteItem {
  id: string;
  adminName: string;
  note: string;
  createdAt: Date | string;
}

export function ApplicationNotes({
  candidateId,
  initialNotes = [],
}: {
  candidateId: string;
  initialNotes?: NoteItem[];
}) {
  const { toast } = useToast();
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setLoading(true);
    try {
      const res = await addApplicationNoteAction(candidateId, newNote);
      if (res.success && res.data) {
        setNotes([res.data as NoteItem, ...notes]);
        setNewNote("");
        toast({ title: "Note Added", description: "Internal note attached to application file.", variant: "success" });
      } else {
        toast({ title: "Error", description: res.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to save internal note.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddNote} className="flex gap-2">
        <Input
          placeholder="Add an internal note or observation..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="bg-white border-[#D7E8D8]"
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-bold gap-1 rounded-xl shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Note
        </Button>
      </form>

      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#D7E8D8] bg-[#F8FAF8] p-4 text-center text-xs text-slate-500">
            No internal notes attached to this application file yet.
          </div>
        ) : (
          notes.map((item) => (
            <div key={item.id} className="rounded-xl border border-[#D7E8D8] bg-[#F8FAF8] p-3 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="flex items-center gap-1.5 text-[#167A3D]">
                  <MessageSquare className="h-3.5 w-3.5" /> {item.adminName}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-slate-500 font-normal">
                  <Clock className="h-3 w-3" /> {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">{item.note}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
