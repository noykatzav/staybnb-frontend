import { useEffect, useRef } from 'react'


export const useEffectUpdate = (callBack, dependencies) => {

    const isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        return callBack()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Callers supply the dependencies and are checked through additionalHooks.
    }, dependencies)
}