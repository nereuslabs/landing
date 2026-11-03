/**
 * NEREUS LANDING SCRIPT (v5 — NEO BRUTALISM)
 * Data-driven roadmap and discrete stepped interactive demos.
 */

// -----------------------------------------------------------------------------
// Data-Driven Roadmap & Future Ideas (Section 1 & 4.8)
// -----------------------------------------------------------------------------
const ROADMAP_PHASES = [
  {
    phase: "Phase 0",
    title: "Architecture RFC & domain model",
    status: "SHIPPED",
    statusClass: "status-chip-shipped",
    summary: "Complete technical specification in docs/ARCHITECTURE.md and strongly typed domain models in Rust."
  },
  {
    phase: "Phase 1",
    title: "State machine & event loop",
    status: "IN DEVELOPMENT",
    statusClass: "status-chip-development",
    summary: "Algebraic learning state enum defined in src/engine; deterministic transition loop in active development."
  },
  {
    phase: "Phase 2",
    title: "Async LLM client",
    status: "IN DEVELOPMENT",
    statusClass: "status-chip-development",
    summary: "LLMClient trait and offline stub verified in code; live streaming network clients planned."
  },
  {
    phase: "Phase 3",
    title: "The four agents with real logic",
    status: "IN DEVELOPMENT",
    statusClass: "status-chip-development",
    summary: "Diagnostic, Coach, Tutor, and Examiner structs scaffolded; implementing dynamic Socratic probing logic."
  },
  {
    phase: "Phase 4",
    title: "Ratatui cockpit with split-pane streaming",
    status: "PLANNED",
    statusClass: "status-chip-planned",
    summary: "Keyboard-driven terminal UI with live roadmap tree, challenge buffer, and streaming Socratic feed."
  },
  {
    phase: "Phase 5",
    title: "WASM code-check sandbox (wasmtime)",
    status: "PLANNED",
    statusClass: "status-chip-planned",
    flagship: true,
    summary: "In-memory WebAssembly isolation sandbox executing learner code safely and passing real compiler/test output to the Examiner."
  }
];

const NEXT_IDEAS = [
  {
    title: "Custom compiler diagnostic linter",
    status: "PLANNED",
    summary: "Static analysis pass checking whether a learner genuinely fixed lifetime bounds or merely masked them."
  },
  {
    title: "Multi-crate architectural katas",
    status: "PLANNED",
    summary: "Evaluating distributed systems challenges involving network protocols and lock-free concurrency."
  }
];

// Render Roadmap Route
function renderRoadmap() {
  const container = document.getElementById("roadmap-route-container");
  if (!container) return;

  container.innerHTML = ROADMAP_PHASES.map((p, idx) => `
    <article class="route-phase-card ${p.flagship ? 'route-phase-flagship' : ''}">
      <div class="route-phase-left">
        <div class="route-waypoint-sq">${idx}</div>
        <div>
          <div class="route-phase-title">${p.phase} — ${p.title}</div>
          <div class="route-phase-desc">${p.summary}</div>
        </div>
      </div>
      <div>
        <span class="status-chip ${p.statusClass}">${p.status}</span>
      </div>
    </article>
  `).join("");

  const ideasContainer = document.getElementById("next-ideas-container");
  if (ideasContainer) {
    ideasContainer.innerHTML = NEXT_IDEAS.map(idea => `
      <article class="route-phase-card">
        <div class="route-phase-left">
          <div class="route-waypoint-sq" style="background-color: var(--dp-color-field); color: var(--dp-color-ink);">+</div>
          <div>
            <div class="route-phase-title">${idea.title}</div>
            <div class="route-phase-desc">${idea.summary}</div>
          </div>
        </div>
        <div>
          <span class="status-chip status-chip-planned">${idea.status}</span>
        </div>
      </article>
    `).join("");
  }
}

// -----------------------------------------------------------------------------
// Scripted Terminal Demo (Discrete stepped playback, real DOM text)
// -----------------------------------------------------------------------------
const TERMINAL_FRAMES = [
  {
    step: 1,
    label: "Kata Dispatched",
    content: `<span class="term-prompt">&gt; Challenge #1: Ownership &amp; Borrowing</span>
<span style="color: var(--dp-color-field);">fn print_message(text: String) {
    println!("{text}");
}

fn main() {
    let greeting = String::from("hello");
    print_message(greeting);
    println!("{greeting}");
}</span>`
  },
  {
    step: 2,
    label: "Compiler Output: Failed",
    content: `<span class="term-prompt">&gt; $ cargo test --quiet</span>
<div class="term-inverse-error">error[E0382]: borrow of moved value: 'greeting'</div>
<span style="color: #9ccbdd;">  --&gt; src/main.rs:8:15</span>
   |
 7 |     print_message(greeting);
   |                   -------- value moved into function here
 8 |     println!("{greeting}");
   |               ^^^^^^^^^^ value borrowed here after move

<div class="term-boxed-verdict term-retry">VERDICT: RETRY</div>`
  },
  {
    step: 3,
    label: "Lighthouse Hint Dispatched",
    content: `<div class="term-boxed-verdict term-retry">VERDICT: RETRY</div>

<div class="term-hint-box">
  <span style="color: var(--dp-color-emphasis); font-weight: 800;">LIGHTHOUSE HINT:</span>
  "Passing 'greeting' directly transferred full ownership to print_message.
   When print_message finished, the string was dropped from memory.
   How can you borrow a read-only reference (&amp;greeting) so main retains ownership?"
</div>`
  },
  {
    step: 4,
    label: "Student Fix Applied",
    content: `<span class="term-prompt">&gt; Student fix applied:</span>
<span style="color: var(--dp-color-ground);">    // Borrow with a reference instead of moving ownership:
    print_message(&amp;greeting);
    println!("{greeting}");</span>

<span class="term-prompt">&gt; $ cargo test --quiet</span>
test tests::test_string_borrow ... ok
<div class="term-boxed-verdict term-pass">VERDICT: PASS · ADVANCING TO REFERENCES &amp; LIFETIMES</div>`
  }
];

let termFrameIndex = 0;
let termPaused = false;
let termTimer = null;

function renderTerminalFrame(index) {
  const body = document.getElementById("terminal-mock-body");
  const stepLabel = document.getElementById("terminal-step-indicator");
  if (!body) return;

  const frame = TERMINAL_FRAMES[index];
  body.innerHTML = frame.content;
  if (stepLabel) {
    stepLabel.textContent = `[Frame ${frame.step}/4: ${frame.label}]`;
  }
}

function runTerminalLoop() {
  if (termPaused) return;

  termFrameIndex = (termFrameIndex + 1) % TERMINAL_FRAMES.length;
  renderTerminalFrame(termFrameIndex);

  // Stepped intervals (no tweening)
  const duration = (termFrameIndex === 1 || termFrameIndex === 2) ? 4500 : 3500;
  termTimer = setTimeout(runTerminalLoop, duration);
}

function toggleTerminalPause() {
  const btn = document.getElementById("term-pause-btn");
  termPaused = !termPaused;

  if (termPaused) {
    if (termTimer) clearTimeout(termTimer);
    if (btn) btn.textContent = "PLAY";
  } else {
    if (btn) btn.textContent = "PAUSE";
    runTerminalLoop();
  }
}

// -----------------------------------------------------------------------------
// Discrete Sandbox Stepped Pipeline
// -----------------------------------------------------------------------------
const PIPELINE_STEPS = ["step-code", "step-sandbox", "step-output", "step-examiner", "step-verdict"];
let currentPipeIdx = 0;

function stepPipeline() {
  PIPELINE_STEPS.forEach((id, idx) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (idx === currentPipeIdx) {
      el.style.backgroundColor = "var(--dp-color-emphasis)";
      el.style.color = "var(--dp-color-ink)";
    } else {
      el.style.backgroundColor = "var(--dp-color-contrast)";
      el.style.color = "var(--dp-color-ink)";
    }
  });
  currentPipeIdx = (currentPipeIdx + 1) % PIPELINE_STEPS.length;
}

// -----------------------------------------------------------------------------
// Initialization
// -----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderRoadmap();

  // Check reduced motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    // Show static final frame
    renderTerminalFrame(TERMINAL_FRAMES.length - 1);
    const pauseBtn = document.getElementById("term-pause-btn");
    if (pauseBtn) pauseBtn.textContent = "STATIC";
  } else {
    renderTerminalFrame(0);
    termTimer = setTimeout(runTerminalLoop, 3500);
    setInterval(stepPipeline, 2000);
  }

  const pauseBtn = document.getElementById("term-pause-btn");
  if (pauseBtn) {
    pauseBtn.addEventListener("click", toggleTerminalPause);
  }
});
