import React from 'react'
import { PuffLoader } from 'react-spinners'

function MainSpinner() {
  return (
    <div className="flex w-screen h-screen items-center justify-center">
        <PuffLoader size={88} color='#498FCD' />
    </div>
  )
}

export default MainSpinner