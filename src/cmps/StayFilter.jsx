import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

export function StayFilter({ filterBy, setFilterBy }) {
    const [ filterToEdit, setFilterToEdit ] = useState(structuredClone(filterBy))

    useEffect(() => {
        setFilterBy(filterToEdit)
    }, [filterToEdit, setFilterBy])

    function handleChange(ev) {
        const type = ev.target.type
        const field = ev.target.name
        let value

        switch (type) {
            case 'text':
            case 'radio':
                value = field === 'sortDir' ? +ev.target.value : ev.target.value
                break
            case 'number':
                value = +ev.target.value || ''
                break
        }
        setFilterToEdit(prevFilter => ({
            ...prevFilter,
            sortDir: prevFilter.sortDir || 1,
            [field]: value,
        }))
    }

    function clearFilter() {
        setFilterToEdit({ ...filterToEdit, txt: '', maxPrice: '' })
    }
    
    function clearSort() {
        setFilterToEdit({ ...filterToEdit, sortField: '', sortDir: '' })
    }

    return <section className="stay-filter">
            <h3>Filter:</h3>
            <input
                type="text"
                name="txt"
                value={filterToEdit.txt}
                placeholder="Free text"
                onChange={handleChange}
                required
            />
            <input
                type="number"
                min="0"
                name="maxPrice"
                value={filterToEdit.maxPrice}
                placeholder="max. price"
                onChange={handleChange}
                required
            />
            <button 
                className="btn-clear" 
                onClick={clearFilter}>Clear</button>
            <h3>Sort:</h3>
            <div className="sort-field">
                <label>
                    <span>Price</span>
                    <input
                        type="radio"
                        name="sortField"
                        value="price"
                        checked={filterToEdit.sortField === 'price'}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    <span>Name</span>
                    <input
                        type="radio"
                        name="sortField"
                        value="name"
                        checked={filterToEdit.sortField === 'name'}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="sort-dir">
                <label>
                    <span>Asce</span>
                    <input
                        type="radio"
                        name="sortDir"
                        value="1"
                        checked={filterToEdit.sortDir === 1}                        
                        onChange={handleChange}
                    />
                </label>
                <label>
                    <span>Desc</span>
                    <input
                        type="radio"
                        name="sortDir"
                        value="-1"
                        onChange={handleChange}
                        checked={filterToEdit.sortDir === -1}                        
                    />
                </label>
            </div>
            <button 
                className="btn-clear" 
                onClick={clearSort}>Clear</button>
    </section>
}

StayFilter.propTypes = {
    filterBy: PropTypes.shape({
        txt: PropTypes.string.isRequired,
        maxPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([''])]),
        sortField: PropTypes.string.isRequired,
        sortDir: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    }).isRequired,
    setFilterBy: PropTypes.func.isRequired,
}
