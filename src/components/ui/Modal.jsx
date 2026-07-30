function Modal({
  open,
  title,
  message,
  children,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-[90%] max-w-md rounded-3xl bg-[#141A22] border border-zinc-700 shadow-2xl p-6">

        <h2 className="text-2xl font-bold text-white">
          {title}
        </h2>

        <p className="mt-3 text-gray-300">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          {children}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default Modal;