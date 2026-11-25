import { useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { loadStays, addStay, updateStay, removeStay } from '../store/actions/stay.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { stayService } from '../services/stay'
import { getFilterFromSearchParams } from '../services/stay/stay-search.service'

import { StayList } from '../cmps/StayList'

export function StayIndex() {

    const { search: queryString } = useLocation()
    const filterBy = useMemo(() => getFilterFromSearchParams(new URLSearchParams(queryString)), [queryString])
    const stays = useSelector(storeState => storeState.stayModule.stays)
    const user = useSelector(storeState => storeState.userModule.user)

    useEffect(() => {
        let isCurrentRequest = true
        loadStays(filterBy).catch(() => {
            if (isCurrentRequest) showErrorMsg('Cannot load stays')
        })
        return () => { isCurrentRequest = false }
    }, [filterBy])

    async function onRemoveStay(stayId) {
        try {
            await removeStay(stayId)
            showSuccessMsg('Stay removed')            
        } catch (err) {
            showErrorMsg('Cannot remove stay')
        }
    }

    async function onAddStay() {
        const stay = stayService.getEmptyStay()
        stay.name = prompt('Name?', 'Some Name')
        try {
            const savedStay = await addStay(stay)
            showSuccessMsg(`Stay added (id: ${savedStay._id})`)
        } catch (err) {
            showErrorMsg('Cannot add stay')
        }        
    }

    async function onUpdateStay(stay) {
        const speed = +prompt('New speed?', stay.speed) || 0
        if(speed === 0 || speed === stay.speed) return

        const stayToSave = { ...stay, speed }
        try {
            const savedStay = await updateStay(stayToSave)
            showSuccessMsg(`Stay updated, new speed: ${savedStay.speed}`)
        } catch (err) {
            showErrorMsg('Cannot update stay')
        }        
    }

    return (
        <section className="stay-index">
            <div className="heading">
                {user && <button type="button" onClick={onAddStay}>Add a Stay</button>}
            </div>
            <StayList 
                stays={stays}
                onRemoveStay={onRemoveStay} 
                onUpdateStay={onUpdateStay}/>
        </section>
    )
}
