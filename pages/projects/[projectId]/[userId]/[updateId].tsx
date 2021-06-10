import React from 'react'
import Button from '../../../../components/Button'

const updateId = () => {
    return (
        <div>
            <Button isDisabled={true} onClick={() => (console.log("You should not be seeing this, I am DISABLED ):<"))}>Disabled</Button>
        </div>
    )
}

export default updateId
