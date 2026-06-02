#!/usr/bin/env python3
"""Interface graphique du glossaire des Jin."""

from __future__ import annotations

import threading
from tkinter import BOTH, END, LEFT, RIGHT, VERTICAL, Canvas, Frame, Listbox, Scrollbar, StringVar, Tk, messagebox, ttk

from generate_jin_audio_gtts import play_or_create_audio
from jin_data import JIN_ENTRIES, JinEntry

BG = "#151413"
PANEL = "#211f1c"
PANEL_SOFT = "#2a2723"
TEXT = "#f4eee3"
MUTED = "#b7aa98"
ACCENT = "#c99a55"
LINE = "#39342d"
SELECTED = "#3a3024"


class ScrollableFrame(ttk.Frame):
    def __init__(self, parent: ttk.Frame) -> None:
        super().__init__(parent, style="Panel.TFrame")
        self.canvas = Canvas(self, bg=PANEL, highlightthickness=0)
        self.scrollbar = ttk.Scrollbar(self, orient=VERTICAL, command=self.canvas.yview)
        self.content = ttk.Frame(self.canvas, style="Panel.TFrame")
        self.window = self.canvas.create_window((0, 0), window=self.content, anchor="nw")

        self.canvas.configure(yscrollcommand=self.scrollbar.set)
        self.canvas.pack(side=LEFT, fill=BOTH, expand=True)
        self.scrollbar.pack(side=RIGHT, fill="y")

        self.content.bind("<Configure>", self._update_scroll_region)
        self.canvas.bind("<Configure>", self._resize_content)

    def _update_scroll_region(self, _event: object) -> None:
        self.canvas.configure(scrollregion=self.canvas.bbox("all"))

    def _resize_content(self, event: object) -> None:
        width = getattr(event, "width", 0)
        self.canvas.itemconfigure(self.window, width=width)


class JinApp:
    def __init__(self, root: Tk) -> None:
        self.root = root
        self.root.title("Jin's - Glossaire")
        self.root.geometry("1120x720")
        self.root.minsize(860, 560)

        self.entries = JIN_ENTRIES
        self.filtered_entries = list(self.entries)
        self.selected_jin: JinEntry | None = None
        self.search = StringVar()
        self.status = StringVar(value="")

        self._configure_style()
        self._build_ui()
        self._populate_list()
        self._show_empty_state()

    def _configure_style(self) -> None:
        self.root.configure(bg=BG)
        style = ttk.Style()
        style.theme_use("clam")
        style.configure("Root.TFrame", background=BG)
        style.configure("Panel.TFrame", background=PANEL)
        style.configure("Soft.TFrame", background=PANEL_SOFT)
        style.configure("TLabel", background=PANEL, foreground=TEXT, font=("Segoe UI", 10))
        style.configure("Title.TLabel", background=BG, foreground=TEXT, font=("Segoe UI", 24, "bold"))
        style.configure("Subtitle.TLabel", background=BG, foreground=MUTED, font=("Segoe UI", 10))
        style.configure("PanelTitle.TLabel", background=PANEL, foreground=TEXT, font=("Segoe UI", 15, "bold"))
        style.configure("Muted.TLabel", background=PANEL, foreground=MUTED, font=("Segoe UI", 10))
        style.configure("Chinese.TLabel", background=PANEL, foreground=TEXT, font=("Microsoft YaHei UI", 52, "bold"))
        style.configure("Pinyin.TLabel", background=PANEL, foreground=ACCENT, font=("Segoe UI", 15, "bold"))
        style.configure("Name.TLabel", background=PANEL, foreground=MUTED, font=("Segoe UI", 12))
        style.configure("SectionTitle.TLabel", background=PANEL, foreground=ACCENT, font=("Segoe UI", 11, "bold"))
        style.configure("Body.TLabel", background=PANEL, foreground=TEXT, font=("Segoe UI", 10), wraplength=620)
        style.configure("Speaker.TButton", background=PANEL_SOFT, foreground=TEXT, font=("Segoe UI", 16), borderwidth=0)
        style.map("Speaker.TButton", background=[("active", SELECTED)])
        style.configure("TEntry", fieldbackground=PANEL_SOFT, foreground=TEXT, bordercolor=LINE, insertcolor=TEXT)
        style.configure("Vertical.TScrollbar", background=PANEL_SOFT, troughcolor=PANEL, bordercolor=PANEL)

    def _build_ui(self) -> None:
        main = ttk.Frame(self.root, style="Root.TFrame", padding=22)
        main.pack(fill=BOTH, expand=True)

        header = ttk.Frame(main, style="Root.TFrame")
        header.pack(fill="x", pady=(0, 18))
        ttk.Label(header, text="Jin's", style="Title.TLabel").pack(anchor="w")
        ttk.Label(
            header,
            text="Glossaire clair des qualités de force des arts martiaux chinois.",
            style="Subtitle.TLabel",
        ).pack(anchor="w", pady=(4, 0))

        self.paned = ttk.PanedWindow(main, orient="horizontal")
        self.paned.pack(fill=BOTH, expand=True)

        self.left_panel = ttk.Frame(self.paned, style="Panel.TFrame", padding=18)
        self.left_panel.configure(width=360)

        self.detail_panel = ttk.Frame(self.paned, style="Panel.TFrame", padding=18)

        self.paned.add(self.left_panel, weight=0)
        self.paned.add(self.detail_panel, weight=1)
        self.root.after(0, lambda: self.paned.sashpos(0, 360))

        ttk.Label(self.left_panel, text="Forces", style="PanelTitle.TLabel").pack(anchor="w")
        search_entry = ttk.Entry(self.left_panel, textvariable=self.search)
        search_entry.pack(fill="x", pady=(14, 12))
        search_entry.insert(0, "")
        self.search.trace_add("write", lambda *_args: self._filter_entries())

        list_frame = Frame(self.left_panel, bg=PANEL)
        list_frame.pack(fill=BOTH, expand=True)
        self.jin_list = Listbox(
            list_frame,
            bg=PANEL_SOFT,
            fg=TEXT,
            selectbackground=SELECTED,
            selectforeground=TEXT,
            activestyle="none",
            highlightthickness=1,
            highlightbackground=LINE,
            borderwidth=0,
            font=("Segoe UI", 10),
        )
        list_scroll = Scrollbar(list_frame, orient=VERTICAL, command=self.jin_list.yview)
        self.jin_list.configure(yscrollcommand=list_scroll.set)
        self.jin_list.pack(side=LEFT, fill=BOTH, expand=True)
        list_scroll.pack(side=RIGHT, fill="y")
        self.jin_list.bind("<<ListboxSelect>>", self._on_select)

        ttk.Label(self.left_panel, textvariable=self.status, style="Muted.TLabel").pack(anchor="w", pady=(12, 0))

        self.scrollable_detail = ScrollableFrame(self.detail_panel)
        self.scrollable_detail.pack(fill=BOTH, expand=True)

    def _populate_list(self) -> None:
        self.jin_list.delete(0, END)
        for jin in self.filtered_entries:
            self.jin_list.insert(END, f"{jin.chinese}   {jin.display_name} · {jin.family}")

    def _filter_entries(self) -> None:
        query = self.search.get().strip().lower()
        if not query:
            self.filtered_entries = list(self.entries)
        else:
            self.filtered_entries = [
                jin for jin in self.entries
                if query in " ".join([jin.chinese, jin.pinyin, jin.display_name, jin.family]).lower()
            ]
        self._populate_list()
        if self.selected_jin not in self.filtered_entries:
            self.selected_jin = None
            self._show_empty_state()

    def _on_select(self, _event: object) -> None:
        selection = self.jin_list.curselection()
        if not selection:
            return
        self.selected_jin = self.filtered_entries[selection[0]]
        self._show_detail(self.selected_jin)

    def _clear_detail(self) -> None:
        for child in self.scrollable_detail.content.winfo_children():
            child.destroy()

    def _show_empty_state(self) -> None:
        self._clear_detail()
        container = self.scrollable_detail.content
        ttk.Label(container, text="Détail sur la force", style="PanelTitle.TLabel").pack(anchor="w")
        ttk.Label(
            container,
            text="Sélectionne une force pour afficher son détail",
            style="Muted.TLabel",
        ).pack(anchor="center", pady=120)
        ttk.Label(container, text="☯", style="Muted.TLabel", font=("Segoe UI Symbol", 46)).pack(anchor="center")

    def _show_detail(self, jin: JinEntry) -> None:
        self._clear_detail()
        container = self.scrollable_detail.content

        header = ttk.Frame(container, style="Panel.TFrame")
        header.pack(fill="x", pady=(0, 20))
        title_block = ttk.Frame(header, style="Panel.TFrame")
        title_block.pack(side=LEFT, fill="x", expand=True)
        ttk.Label(title_block, text=jin.chinese, style="Chinese.TLabel").pack(anchor="w")
        ttk.Label(title_block, text=jin.pinyin, style="Pinyin.TLabel").pack(anchor="w", pady=(2, 0))
        ttk.Label(title_block, text=f"{jin.display_name} · {jin.family}", style="Name.TLabel").pack(anchor="w", pady=(4, 0))
        ttk.Button(header, text="🔊", style="Speaker.TButton", width=4, command=lambda: self._play_or_create(jin)).pack(side=RIGHT, padx=(18, 0))

        self._add_section("Définition", jin.short_definition)
        self._add_section("Explication détaillée", jin.detailed_explanation)
        self._add_section("Biomécanique", jin.biomechanics)
        self._add_section("Drill / exercice", jin.drill)
        self._add_section("Application martiale", jin.martial_application)
        self._add_section("Erreurs fréquentes", jin.common_mistakes)
        self._add_section("Jalon de maîtrise", jin.mastery_milestone)

    def _add_section(self, title: str, text: str) -> None:
        if not text:
            return
        frame = ttk.Frame(self.scrollable_detail.content, style="Panel.TFrame")
        frame.pack(fill="x", pady=(0, 18))
        ttk.Label(frame, text=title, style="SectionTitle.TLabel").pack(anchor="w")
        ttk.Label(frame, text=text, style="Body.TLabel").pack(anchor="w", pady=(5, 0), fill="x")

    def _play_or_create(self, jin: JinEntry) -> None:
        self.status.set("Préparation de l'audio...")

        def worker() -> None:
            try:
                path = play_or_create_audio(jin)
            except Exception as exc:
                self.root.after(0, lambda: self._audio_error(str(exc)))
            else:
                self.root.after(0, lambda: self.status.set(f"Lecture : {path.name}"))

        threading.Thread(target=worker, daemon=True).start()

    def _audio_error(self, message: str) -> None:
        self.status.set("Audio indisponible")
        messagebox.showerror("Audio indisponible", message)


def main() -> None:
    root = Tk()
    JinApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
