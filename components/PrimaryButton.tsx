import React from 'react'
import Button from './Button'

const PrimaryButton = ({onClick, text}) => {
    return (
        <div>
            <Button onClick={onClick} text={text}/>
        </div>
    )
}

export default PrimaryButton
