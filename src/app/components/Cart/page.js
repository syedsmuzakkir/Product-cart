"use client";
import { UseSelector, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { remove } from "@/app/store/CartSlice";
import Link from "next/link";
const CartProducts = () => {
const prd = useSelector((state) => state.cart);


const dispatch = useDispatch()

  const RemoveFromCart = (id)=>{
    
    dispatch(remove(id))

  }

  const Cards = prd.map((prod) => {
    return (
      <div
        key={prod.id}
        className="container flex flex-col justify-center items-center shadow-lg m-2 border rounded-2xl gap-2 "
      >
        <h2>{prod.title}</h2>
        <img className="w-[200px] h-[200px]" src={prod.image} />
        <h3> &#x20B9; {prod.price} </h3>
        {/* <p> {product.description} </p> */}
        <button
          className=" p-2 text-white m-1 bg-red-400"
          onClick={() => RemoveFromCart(prod.id)} 
        >
          Remove
        </button>
      </div>
    );
  });

  return (
    <div className="tex-center flex  flex-col items-center justify-center leading-8">
      <h2>Your Product Cart Items</h2>

      <Link href={'../../'}  className="bg-slate-500 text-white p-2" >Back</Link>
<div className="grid sm:grid-cols-2 md:grid-cols-3  xl:grid-cols-4 justify-center items-center" >
{Cards}
</div>
      
    </div>
  );
};

export default CartProducts;
