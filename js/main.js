/* =================================================================
   Nereus 2.0 Landing Page - Interactive JavaScript
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Copy command clipboard functionality
  const copyBtn = document.getElementById('copy-command-btn');
  const commandText = document.getElementById('command-text');

  if (copyBtn && commandText) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(commandText.textContent.trim());
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>
        `;
        copyBtn.style.color = 'var(--accent-cyan)';
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          copyBtn.style.color = '';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    });
  }

  // 2. Interactive TUI Terminal Mockup Tabs & Topic selection
  const tuiTabs = document.querySelectorAll('.tui-tab');
  const tuiPanes = document.querySelectorAll('.tui-pane');

  tuiTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      // Update tabs
      tuiTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update panes
      tuiPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `pane-${targetTab}`) {
          pane.classList.add('active');
        }
      });
    });
  });

  // Interactive topics in the TUI mockup
  const topicItems = document.querySelectorAll('.tui-list-item[data-topic]');
  const socraticFeedbackBox = document.getElementById('socratic-feedback-text');

  const topicFeedbacks = {
    'async-lifetimes': 'Nereus Examiner: "You stored a reference with local lifetime in an async spawn block. What happens when the enclosing scope exits before the spawned future completes? Hint: consider \'static or moving ownership."',
    'fsm-states': 'Nereus Examiner: "Your FSM state transition from Diagnostic to Coach bypasses the validation barrier. How does the graph enforce state invariance without locking the actor thread?"',
    'socratic-hints': 'Nereus Tutor: "Remember, giving you the answer robs you of mastery. Look closely at how the closure captures environment variables. Can you borrow mutably twice?"',
    'diagnostic-quiz': 'Nereus Diagnostic: "Quiz completed. Weakness identified in unsafe pointer arithmetic and pin projections. Generating customized katas..."'
  };

  topicItems.forEach(item => {
    item.addEventListener('click', () => {
      topicItems.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');

      const topicKey = item.getAttribute('data-topic');
      if (socraticFeedbackBox && topicFeedbacks[topicKey]) {
        socraticFeedbackBox.style.opacity = '0.4';
        setTimeout(() => {
          socraticFeedbackBox.textContent = topicFeedbacks[topicKey];
          socraticFeedbackBox.style.opacity = '1';
        }, 150);
      }
    });
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
