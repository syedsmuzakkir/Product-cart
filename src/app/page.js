"use client"
import Image from "next/image";
import Product from "./components/Product";
import Link from "next/link";


import Cart from "./components/Cart";

import store from "./store/store";
import { Provider, UseSelector, useSelector } from "react-redux";
export default function Home() {
  const cartProducts = useSelector((state)=>state.cart);


  return (
   

    // <Provider store={store}>
      
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className=" bg-slate-200 p-2 border rounded-3xl cursor-pointer">
        <Link href={'./components/Cart'}>
         Items: {cartProducts.length}
        </Link>
      </div>
     <Product/>

    </main>
  //  </Provider>

  );
}
