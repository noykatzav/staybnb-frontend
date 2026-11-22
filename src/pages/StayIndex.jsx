import { useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

import { loadStays, addStay, updateStay, removeStay } from '../store/actions/stay.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { stayService } from '../services/stay'
import { getFilterFromSearchParams } from '../services/stay/stay-search.service'

import { StayList } from '../cmps/StayList'
import { StayHeader } from '../cmps/header/StayHeader'

export function StayIndex() {

    const [searchParams, setSearchParams] = useSearchParams()
    const searchKey = searchParams.toString()
    const filterBy = useMemo(() => getFilterFromSearchParams(new URLSearchParams(searchKey)), [searchKey])
    const stays = useSelector(storeState => storeState.stayModule.stays)
    const user = useSelector(storeState => storeState.userModule.user)

    useEffect(() => {
        loadStays(filterBy).catch(() => showErrorMsg('Cannot load stays'))
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
            <StayHeader filterBy={filterBy} onSearch={setSearchParams} isCompact={Boolean(searchKey)} />
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
