import { useEffect } from 'react'
import PropTypes from 'prop-types'

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
                <button
                    className="modal-close-btn"
                    onClick={onClose}
                    aria-label="Close modal"
                    type="button"
                >
                    ×
                </button>

                {title && <h2 className="modal-title">{title}</h2>}

                <div className="modal-content">
                    {children}
                </div>
            </section>
        </div>
    )
}

Modal.propTypes = {
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
}
