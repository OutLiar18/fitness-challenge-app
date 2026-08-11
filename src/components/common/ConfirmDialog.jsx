import { useEffect, useRef, useState } from "react";
import "./ConfirmDialog.css";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  loadingLabel = "Deleting…",
  confirmationPhrase = "",
  confirmationPrompt = "",
  onConfirm,
  onCancel,
}) {
  const panelRef = useRef(null);
  const cancelRef = useRef(null);
  const previousFocusRef = useRef(null);
  const cancelHandlerRef = useRef(onCancel);
  const loadingRef = useRef(loading);
  const [phrase, setPhrase] = useState("");
  const phraseRequired = Boolean(confirmationPhrase);
  const phraseMatches = !phraseRequired || phrase.trim() === confirmationPhrase;

  useEffect(() => {
    cancelHandlerRef.current = () => {
      setPhrase("");
      onCancel?.();
    };
  }, [onCancel]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    if (!open) return undefined;

    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      cancelRef.current?.focus();
    });

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        if (!loadingRef.current) cancelHandlerRef.current?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        panelRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) ?? [],
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      const previousFocus = previousFocusRef.current;
      if (previousFocus?.isConnected) {
        window.requestAnimationFrame(() => previousFocus.focus());
      }
    };
  }, [open]);

  if (!open) return null;

  function handleCancel() {
    if (loading) return;
    setPhrase("");
    onCancel?.();
  }

  function handleConfirm() {
    if (loading || !phraseMatches) return;
    setPhrase("");
    onConfirm?.();
  }

  function handleBackdropMouseDown(event) {
    if (event.target === event.currentTarget) {
      handleCancel();
    }
  }

  return (
    <div
      className="confirm-dialog__backdrop"
      onMouseDown={handleBackdropMouseDown}
    >
      <section
        className="confirm-dialog"
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        aria-busy={loading || undefined}
      >
        <div className="confirm-dialog__icon" aria-hidden="true">!</div>
        <div className="confirm-dialog__copy">
          <p>Confirm action</p>
          <h2 id="confirm-dialog-title">{title}</h2>
          <p id="confirm-dialog-description">{description}</p>
        </div>
        {phraseRequired && (
          <label className="confirm-dialog__phrase" htmlFor="confirm-dialog-phrase">
            <span>
              {confirmationPrompt || `Type ${confirmationPhrase} to continue.`}
            </span>
            <input
              id="confirm-dialog-phrase"
              autoComplete="off"
              value={phrase}
              disabled={loading}
              onChange={(event) => setPhrase(event.target.value)}
            />
          </label>
        )}
        <div className="confirm-dialog__actions">
          <button
            className="button button--secondary"
            type="button"
            ref={cancelRef}
            disabled={loading}
            onClick={handleCancel}
          >
            {cancelLabel}
          </button>
          <button
            className="button button--danger"
            type="button"
            disabled={loading || !phraseMatches}
            onClick={handleConfirm}
          >
            {loading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
