import React, { useEffect, useRef } from 'react'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = '' }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog ref={dialogRef} className="modal" onClose={handleClose}>
      <div className={`modal-box ${size}`}>
        {title && <h3 className="font-bold text-lg">{title}</h3>}
        <div className="py-4">
          {children}
        </div>
        <div className="modal-action">
          <button className="btn" onClick={handleClose}>Close</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
};

export default Modal