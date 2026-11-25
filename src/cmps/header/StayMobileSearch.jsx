import PropTypes from 'prop-types'
import { StayCategories } from './StayCategories'

export function StayMobileSearch({
    compactLabels, hasSearchFilter, hasGuestFilter, activeField, isOpen,
    triggerRef, dialogRef, destinationField, dateField, guestField,
    onOpenSearch, onCloseSearch, onClearSearch, onSelectField, onSubmitSearch, onDialogKeyDown,
}) {
    const triggerLabel = hasSearchFilter
        ? [compactLabels.destination, compactLabels.dates, hasGuestFilter && compactLabels.guests].filter(Boolean).join(' · ')
        : 'Start your search'

    return (
        <div className="stay-mobile-search">
            <button ref={triggerRef} type="button" className="mobile-search-trigger" onClick={onOpenSearch} aria-label="Start your search">
                <img src="/icons/search-filled.svg" alt="" />
                <span>{triggerLabel}</span>
            </button>
            {isOpen && (
                <div ref={dialogRef} className="mobile-search-dialog" role="dialog" aria-modal="true" aria-label="Find a stay" onKeyDownCapture={onDialogKeyDown}>
                    <div className="dialog-top">
                        <StayCategories isMobile isDialog />
                        <button type="button" className="btn-close" onClick={onCloseSearch} aria-label="Close search">
                            <img src="/icons/close.svg" alt="" />
                        </button>
                    </div>
                    <form className="stay-search mobile" role="search" aria-label="Find a stay" onSubmit={onSubmitSearch}>
                        <div className="mobile-fields">
                            <section className={`mobile-field${activeField === 'destination' ? ' active' : ''}`}>
                                {activeField === 'destination' ? (
                                    <>
                                        <h2>Where?</h2>
                                        {destinationField}
                                    </>
                                ) : (
                                    <button type="button" className="field-summary" onClick={() => onSelectField('destination')}>
                                        <span>Where</span><strong>{compactLabels.destination}</strong>
                                    </button>
                                )}
                            </section>
                            <section className={`mobile-field${activeField === 'dates' ? ' active' : ''}`}>
                                {activeField === 'dates' ? (
                                    <>
                                        <h2>When?</h2>
                                        {dateField}
                                    </>
                                ) : (
                                    <button type="button" className="field-summary" onClick={() => onSelectField('dates')}>
                                        <span>When</span><strong>{compactLabels.dates}</strong>
                                    </button>
                                )}
                            </section>
                            <section className={`mobile-field${activeField === 'guests' ? ' active' : ''}`}>
                                {activeField === 'guests' ? (
                                    <>
                                        <h2>Who?</h2>
                                        {guestField}
                                    </>
                                ) : (
                                    <button type="button" className="field-summary" onClick={() => onSelectField('guests')}>
                                        <span>Who</span><strong>{compactLabels.guests}</strong>
                                    </button>
                                )}
                            </section>
                        </div>
                        <footer className="mobile-search-actions">
                            <button type="button" className="btn-clear" onClick={onClearSearch}>Clear all</button>
                            <button type="submit" className="btn-submit">
                                <img src="/icons/search-white.svg" alt="" />Search
                            </button>
                        </footer>
                    </form>
                </div>
            )}
        </div>
    )
}

StayMobileSearch.propTypes = {
    compactLabels: PropTypes.shape({
        destination: PropTypes.string.isRequired,
        dates: PropTypes.string.isRequired,
        guests: PropTypes.string.isRequired,
    }).isRequired,
    hasSearchFilter: PropTypes.bool.isRequired,
    hasGuestFilter: PropTypes.bool.isRequired,
    activeField: PropTypes.oneOf(['destination', 'dates', 'guests']),
    isOpen: PropTypes.bool.isRequired,
    triggerRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
    dialogRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
    destinationField: PropTypes.node.isRequired,
    dateField: PropTypes.node.isRequired,
    guestField: PropTypes.node.isRequired,
    onOpenSearch: PropTypes.func.isRequired,
    onCloseSearch: PropTypes.func.isRequired,
    onClearSearch: PropTypes.func.isRequired,
    onSelectField: PropTypes.func.isRequired,
    onSubmitSearch: PropTypes.func.isRequired,
    onDialogKeyDown: PropTypes.func.isRequired,
}
