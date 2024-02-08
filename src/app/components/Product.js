"use client"

import React from 'react'

import { useState, useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { add } from '../store/CartSlice'


const Product = () => {

    const [products, setproducts] = useState([])

    useEffect(()=>{
 
         const ApiData = async()=>{
              const ProductUrl = await fetch('https://fakestoreapi.com/products')
              const response = await ProductUrl.json()
              

             console.log(response)
             setproducts(response)

         }
         ApiData()

        // const ApiData = () => {
        //     fetch('https://fakestoreapi.com/products')
        //       .then((response) => response.json())
        //       .then((data) => {
        //         console.log(data);
        //       });
        //   };
          
        //   ApiData();
          

    },[])


    const  Cards = products.map((product)=>{
        return(
            <div key={product.id} className='container flex flex-col justify-center items-center'> 
                <h2>{product.title}</h2>
                <img className='w-[200px] h-[200px]' src={product.image}/>
                 <h3> &#x20B9; {product.price} </h3>
                {/* <p> {product.description} </p> */}
                <button className='bg-slate-700 p-2 text-white m-1' onClick={()=>addToCart(product)} >Add to Cart</button>


            </div>
        )
    })

    const dispatch = useDispatch()
   const addToCart = (product)=>{
           dispatch(add(product))
   }

  return (
    <div className='grid gap-3 xl:grid-cols-5 sm:grid-cols-2 md:grid-cols-3 justify-center items-center'>

        {Cards}
    </div>
  )
}

export default Product