export function StayOrder() {
  return (
    <aside className="stay-order" aria-label="Booking">
      <h2>Add dates for prices</h2>

      <div className="stay-order-fields">
        <div className="stay-order-field">
          <span className="stay-order-label">CHECK-IN</span>
          <span className="stay-order-value stay-order-placeholder">
            Add date
          </span>
        </div>

        <div className="stay-order-field stay-order-checkout">
          <span className="stay-order-label">CHECKOUT</span>
          <span className="stay-order-value stay-order-placeholder">
            Add date
          </span>
        </div>

        <div className="stay-order-field stay-order-guests">
          <div>
            <span className="stay-order-label">GUESTS</span>
            <span className="stay-order-value">1 guest</span>
          </div>

          <img src="/icons/chevron-down.svg" alt="" />
        </div>
      </div>

      <button type="button" className="stay-order-button">
        Check availability
      </button>
    </aside>
  )
}