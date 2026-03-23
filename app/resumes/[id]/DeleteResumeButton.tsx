"use client";

import { deleteResume } from "@/actions/resume";

export default function DeleteResumeButton({ id }: { id: string }) {
  return (
    <form action={async () => { await deleteResume(id); }}>
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2.5 rounded-xl text-sm font-headline font-semibold transition-colors border border-red-200/40"
        onClick={(e) => {
          if (!confirm("Delete this resume?")) e.preventDefault();
        }}
      >
        <span className="material-symbols-outlined text-[18px]">delete</span>
        Delete
      </button>
    </form>
  );
}
