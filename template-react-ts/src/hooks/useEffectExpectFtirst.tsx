import { useRef, useEffect } from 'react'

const useEffectExceptFirst = (fn: any, deps: any[]) => {
    const isMounted = useRef(false)

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true
            return
        }

        fn()
    }, deps)
}

export default useEffectExceptFirst