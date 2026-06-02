#!/usr/bin/env python3
"""Interface graphique pour le generateur audio des Jin."""

from __future__ import annotations

import contextlib
import io
import os
import queue
import threading
from pathlib import Path
from tkinter import BOTH, END, LEFT, RIGHT, X, StringVar, Tk, filedialog, messagebox, ttk

import generate_jin_audio_gtts as generator


class QueueWriter(io.TextIOBase):
    def __init__(self, log_queue: queue.Queue[str]) -> None:
        self.log_queue = log_queue

    def write(self, text: str) -> int:
        if text:
            self.log_queue.put(text)
        return len(text)

    def flush(self) -> None:
        return None


class JinAudioApp:
    def __init__(self, root: Tk) -> None:
        self.root = root
        self.root.title("Jin's - Generateur audio")
        self.root.geometry("980x680")
        self.root.minsize(760, 560)

        self.log_queue: queue.Queue[str] = queue.Queue()
        self.terms = generator.get_all_terms()
        self.output_dir = StringVar(value=str(Path.cwd()))
        self.mode = StringVar(value="single")
        self.status = StringVar(value="Pret")
        self.is_running = False

        self._build_ui()
        self._populate_terms()
        self._poll_logs()

    def _build_ui(self) -> None:
        self.root.configure(bg="#f5f1eb")

        style = ttk.Style()
        style.theme_use("clam")
        style.configure("TFrame", background="#f5f1eb")
        style.configure("Panel.TFrame", background="#ffffff", relief="flat")
        style.configure("TLabel", background="#f5f1eb", foreground="#181818", font=("Segoe UI", 10))
        style.configure("Title.TLabel", background="#f5f1eb", foreground="#181818", font=("Segoe UI", 24, "bold"))
        style.configure("Muted.TLabel", background="#f5f1eb", foreground="#6d665d", font=("Segoe UI", 10))
        style.configure("Panel.TLabel", background="#ffffff", foreground="#181818", font=("Segoe UI", 10))
        style.configure("Accent.TButton", font=("Segoe UI", 10, "bold"))
        style.configure("TRadiobutton", background="#ffffff", foreground="#181818", font=("Segoe UI", 10))

        main = ttk.Frame(self.root, padding=22)
        main.pack(fill=BOTH, expand=True)

        header = ttk.Frame(main)
        header.pack(fill=X, pady=(0, 18))
        ttk.Label(header, text="Jin's", style="Title.TLabel").pack(anchor="w")
        ttk.Label(
            header,
            text="Interface graphique pour generer le glossaire audio Mandarin / Francais.",
            style="Muted.TLabel",
        ).pack(anchor="w", pady=(4, 0))

        content = ttk.Frame(main)
        content.pack(fill=BOTH, expand=True)

        left_panel = ttk.Frame(content, style="Panel.TFrame", padding=18)
        left_panel.pack(side=LEFT, fill=BOTH, expand=True, padx=(0, 12))

        right_panel = ttk.Frame(content, style="Panel.TFrame", padding=18)
        right_panel.pack(side=RIGHT, fill=BOTH, expand=True, padx=(12, 0))

        ttk.Label(left_panel, text="Generation", style="Panel.TLabel", font=("Segoe UI", 15, "bold")).pack(anchor="w")

        mode_frame = ttk.Frame(left_panel, style="Panel.TFrame")
        mode_frame.pack(fill=X, pady=(14, 18))
        ttk.Radiobutton(
            mode_frame,
            text="Un Jin selectionne",
            variable=self.mode,
            value="single",
            command=self._sync_mode,
        ).pack(anchor="w", pady=3)
        ttk.Radiobutton(
            mode_frame,
            text="Glossaire complet",
            variable=self.mode,
            value="all",
            command=self._sync_mode,
        ).pack(anchor="w", pady=3)

        ttk.Label(left_panel, text="Dossier de sortie", style="Panel.TLabel").pack(anchor="w")
        output_row = ttk.Frame(left_panel, style="Panel.TFrame")
        output_row.pack(fill=X, pady=(7, 18))
        self.output_entry = ttk.Entry(output_row, textvariable=self.output_dir)
        self.output_entry.pack(side=LEFT, fill=X, expand=True)
        ttk.Button(output_row, text="Choisir", command=self._choose_output_dir).pack(side=RIGHT, padx=(8, 0))

        ttk.Label(left_panel, text="Jin", style="Panel.TLabel").pack(anchor="w")
        self.term_combo = ttk.Combobox(left_panel, state="readonly")
        self.term_combo.pack(fill=X, pady=(7, 18))

        ttk.Label(left_panel, textvariable=self.status, style="Panel.TLabel").pack(anchor="w", pady=(0, 12))

        actions = ttk.Frame(left_panel, style="Panel.TFrame")
        actions.pack(fill=X)
        self.generate_button = ttk.Button(
            actions,
            text="Generer l'audio",
            style="Accent.TButton",
            command=self._start_generation,
        )
        self.generate_button.pack(side=LEFT)
        ttk.Button(actions, text="Effacer le journal", command=self._clear_log).pack(side=LEFT, padx=(10, 0))

        ttk.Label(right_panel, text="Journal", style="Panel.TLabel", font=("Segoe UI", 15, "bold")).pack(anchor="w")
        log_frame = ttk.Frame(right_panel, style="Panel.TFrame")
        log_frame.pack(fill=BOTH, expand=True, pady=(14, 0))

        self.log_text = ttk.Treeview(log_frame, columns=("line",), show="headings", height=18)
        self.log_text.heading("line", text="Evenements")
        self.log_text.column("line", width=420, anchor="w")
        scrollbar = ttk.Scrollbar(log_frame, orient="vertical", command=self.log_text.yview)
        self.log_text.configure(yscrollcommand=scrollbar.set)
        self.log_text.pack(side=LEFT, fill=BOTH, expand=True)
        scrollbar.pack(side=RIGHT, fill="y")

    def _populate_terms(self) -> None:
        values = [
            f"{index + 1:02d}. {chinese} - {pinyin} - {meaning}"
            for index, (chinese, pinyin, meaning, _section) in enumerate(self.terms)
        ]
        self.term_combo["values"] = values
        if values:
            self.term_combo.current(0)

    def _sync_mode(self) -> None:
        self.term_combo.configure(state="disabled" if self.mode.get() == "all" else "readonly")

    def _choose_output_dir(self) -> None:
        selected = filedialog.askdirectory(initialdir=self.output_dir.get() or str(Path.cwd()))
        if selected:
            self.output_dir.set(selected)

    def _start_generation(self) -> None:
        if self.is_running:
            return

        output_path = Path(self.output_dir.get()).expanduser()
        if not output_path.exists() or not output_path.is_dir():
            messagebox.showerror("Dossier invalide", "Choisis un dossier de sortie existant.")
            return

        selected_index = self.term_combo.current()
        if self.mode.get() == "single" and selected_index < 0:
            messagebox.showerror("Selection manquante", "Choisis un Jin dans la liste.")
            return

        self.is_running = True
        self.status.set("Generation en cours...")
        self.generate_button.configure(state="disabled")

        worker = threading.Thread(
            target=self._run_generation,
            args=(output_path, selected_index),
            daemon=True,
        )
        worker.start()

    def _run_generation(self, output_path: Path, selected_index: int) -> None:
        previous_cwd = Path.cwd()
        writer = QueueWriter(self.log_queue)

        try:
            os.chdir(output_path)
            with contextlib.redirect_stdout(writer), contextlib.redirect_stderr(writer):
                if self.mode.get() == "all":
                    generator.generate_all()
                else:
                    generator.generate_single(selected_index, self.terms)
            self.log_queue.put("\nGeneration terminee.\n")
            self.root.after(0, lambda: self.status.set("Termine"))
        except Exception as exc:
            error_message = str(exc)
            self.log_queue.put(f"\nErreur : {error_message}\n")
            self.root.after(0, lambda: self.status.set("Erreur"))
            self.root.after(0, lambda: messagebox.showerror("Generation impossible", error_message))
        finally:
            os.chdir(previous_cwd)
            self.root.after(0, self._unlock_generation)

    def _unlock_generation(self) -> None:
        self.is_running = False
        self.generate_button.configure(state="normal")

    def _poll_logs(self) -> None:
        while True:
            try:
                text = self.log_queue.get_nowait()
            except queue.Empty:
                break
            for line in text.splitlines():
                if line.strip():
                    self.log_text.insert("", END, values=(line,))
                    self.log_text.yview_moveto(1)
        self.root.after(120, self._poll_logs)

    def _clear_log(self) -> None:
        for item in self.log_text.get_children():
            self.log_text.delete(item)


def main() -> None:
    root = Tk()
    JinAudioApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
