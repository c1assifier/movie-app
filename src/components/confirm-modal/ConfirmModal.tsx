import { createPortal } from 'react-dom'
import { Button } from '@vkontakte/vkui'
import '@/components/confirm-modal/ConfirmModal.css'

type ConfirmModalProps = {
  isOpen: boolean
  title: string
  description: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="confirm-modal" role="presentation" onClick={onCancel}>
      <div
        className="confirm-modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirm-modal__content">
          <h2 id="confirm-modal-title" className="confirm-modal__title">
            {title}
          </h2>
          <p className="confirm-modal__description">{description}</p>
        </div>

        <div className="confirm-modal__actions">
          <Button mode="secondary" size="m" stretched onClick={onCancel}>
            {cancelText}
          </Button>
          <Button mode="primary" size="m" stretched onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
