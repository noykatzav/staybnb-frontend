
import { useEffect } from 'react'

export function Modal({ children, onClose, title }) {

    useEffect(() => {
        function handleKeyDown(ev) {
            if (ev.key === 'Escape') onClose()
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [onClose])

    function onBackdropClick(ev) {
        if (ev.target === ev.currentTarget) onClose()
    }

    return (
        <div
            className="modal-backdrop"
            onMouseDown={onBackdropClick}
        >
            <section
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                {title && <h2 className="modal-title">{title}</h2>}

                <div className="modal-content">
                    {children}
                </div>
            </section>
        </div>
    )
}
