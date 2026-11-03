# Nereus Landing Page — Design Notes & Verification

## 1. Design Rationale (Brief v5)

1. **Concept**: An assembled press sheet executed in Neo Brutalism — solid 4px/3px abyss-ink outlines, hard offset shadows, overlapping headline strips, and square corners, presenting an honest, build-in-public dev tool.
2. **Palette (All Sea)**: Foam paper (`#e3f1ee`), abyss ink (`#04202b`), sea-glass aqua (`#5fd1c4`), ocean blue (`#1b6ca8`), shallows (`#9ccbdd`), sea-salt white (`#f6fbfa`), deep water (`#0a3d4f`), and open-water teal (`#0a6b79`). Zero yellow, red, violet, or pure black.
3. **Typography**: Self-hosted Host Grotesk (`"NeoBrutalismHost"`) throughout for display and body text; system monospace stack strictly for code and terminal displays.
4. **Hero Demo Script**: Discrete stepped terminal playback (challenge presented → student types moved value error → inverse-video `E0382` error → `RETRY` verdict → Socratic Lighthouse Hint question → student clones sender → `PASS` verdict → topic advances).
5. **Sandbox Pipeline Visual**: Clean SVG/CSS pipeline with a 4px framed `wasmtime · in-memory` sandbox boundary, illustrating safe isolation and compiler output feeding the Examiner.
6. **Deliberate Omissions**: No install-and-run hero block (session execution not yet wired), no fake performance claims (<5ms, 15MB), no false test counts, no emojis, no rounded corners, no blurred drop shadows, no marketing fluff.
7. **Restraint & Seams**: Visible section seams (3px ink lines), paper slips with static tilt (≤ 1.5°), and immediate (0s) control interactions.
8. **Forward-Looking Ambition**: Highlight the planned in-memory WASM execution sandbox as the flagship Phase 5 milestone, clearly labeled as `PLANNED`.
9. **Data-Driven Architecture**: The voyage roadmap and future features list are rendered dynamically from a typed JavaScript array at the top of the script.
10. **Accessibility & Rigor**: Fully keyboard-operable, visible focus rings, pause/replay control for animations, static frames under `prefers-reduced-motion`, and WCAG AA contrast compliance across all color pairings.

---

## 2. Feature Status & Repository Evidence

| Feature / Claim | Status | Evidence in Repository (`nereuslabs/nereus`) |
|---|---|---|
| Domain Models (Profile, Roadmap, Assessment, Verdict) | `SHIPPED` | Defined in `src/models/mod.rs` |
| Learning-State Enum (`LearningState`) | `IN DEVELOPMENT` | Defined in `src/engine/mod.rs`; transition loop not yet implemented |
| 4 Specialized Agents (Diagnostic, Coach, Tutor, Examiner) | `IN DEVELOPMENT` | Placeholder structs defined in `src/agents/`; canned responses |
| Async LLM Client Trait & Offline Stub | `SHIPPED` | Trait `LLMClient` & `StubLLMClient` in `src/llm/mod.rs` |
| CLI Argument Parser (`clap`) | `SHIPPED` | Implemented in `src/main.rs` (prints lighthouse banner and exits) |
| Live Session Execution / Event Loop | `IN DEVELOPMENT` | CLI exits after banner; session runtime in progress |
| Ratatui Terminal UI Cockpit | `PLANNED` | Dependency declared in `Cargo.toml`; no UI code written |
| SQLite Session Persistence | `PLANNED` | Dependency declared in `Cargo.toml`; persistence logic not started |
| WebAssembly (WASM) Sandbox (`wasmtime`) | `PLANNED` | Architectural spec in `docs/ARCHITECTURE.md` (Roadmap Phase 5) |
| Multi-Provider Cloud LLM (OpenRouter/Anthropic) | `PLANNED` | Trait exists; network clients not yet implemented |
| Automated Test Suite & CI Workflows | `PLANNED` | `.github/workflows` is currently empty |
