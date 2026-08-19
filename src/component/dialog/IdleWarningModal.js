function IdleWarningModal({ show, remainingSeconds, onContinue }) {
  if (!show) return null;
  const mm = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const ss = String(remainingSeconds % 60).padStart(2, "0");

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>Hareketsizlik nedeniyle oturumunuz {mm}:{ss} içinde kapanacak.</p>
        <button onClick={onContinue}>Oturumu Devam Ettir</button>
      </div>
    </div>
  );
}

export default IdleWarningModal