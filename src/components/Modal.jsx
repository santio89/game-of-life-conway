import React, { useRef } from 'react'

export default function Modal() {
    const modal = useRef()

    
    return (
        <div ref={modal}>Modal</div>
    )
}
