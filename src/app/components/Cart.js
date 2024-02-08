import React from 'react'

const Cart = () => {

 
    const selectCounterValue = state => state.value
    const currentValue = selectCounterValue(store.getState())
    console.log(currentValue)

  return (
    <div>Cart</div>
  )
}

export default Cart