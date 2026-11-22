export const dateService = {
    getDateKey,
    getDate,
    addDays,
    addMonths,
    getMonthStart,
}

function getDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function getDate(key) {
    const [year, month, day] = key.split('-').map(Number)
    return new Date(year, month - 1, day)
}

function addDays(date, count) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + count)
}

function addMonths(date, count) {
    const month = new Date(date.getFullYear(), date.getMonth() + count, 1)
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    return new Date(month.getFullYear(), month.getMonth(), Math.min(date.getDate(), lastDay))
}

function getMonthStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1)
}
