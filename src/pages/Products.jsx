import React,{useEffect, useState} from "react";
import axios from "axios";
import {Link} from'react-router-dom'

function Products(){
    const API_URL=import.meta.env.VITE_API_URL;
    const [products,setProducts]=useState([])
    const [error, setError]=useState(null)
    const [loading, setLoading]=useState(true)
    useEffect(()=>{
        axios.get(`${API_URL}/products/get/`)
        .then((res)=>{
            if(res.data.success){
            setProducts(res.data.data)
            console.log(res.data)}
            else{
                setError('Failed to load products')
            }
            setLoading(false)
        })
        .catch(()=>{
            setError("Network Error")
            setLoading(false)
        })
    },[])
    if(loading) return <div>loading products ....</div>
    if(error) return <div className="text-red-500">{error}</div>
    return (
  <div className="p-6 bg-green-50 min-h-screen">
    <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 border-b-2 border-green-400 inline-block pb-1">
      Available Products
    </h2>

    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <Link to={`/products/${p.id}`} key={p.id}>
        <div
          className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow duration-300"
        >
          {p.image ? (
            <img
              src={p.image}
              alt={p.name}
              className="h-40 w-full object-cover rounded mb-4"
            />
          ) : (
            <div className="h-40 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}

          <h3 className="text-lg font-semibold text-gray-800 mb-1">{p.name}</h3>
          <p className="text-sm text-gray-500 mb-2 capitalize">{p.category}</p>
          <p className="text-sm text-gray-700 mb-2 line-clamp-3">
            {p.description || "No description available."}
          </p>

          <p className="font-bold text-green-800 text-lg mb-1">₹{p.price}</p>
          <p className="text-xs text-gray-500 mb-2">
            Delivery in {p.delivery_time} day{p.delivery_time > 1 ? "s" : ""}
          </p>

          {p.is_available ? (
            <span className="text-green-600 text-sm font-medium">✔ In stock</span>
          ) : (
            <span className="text-red-600 text-sm font-medium">❌ Out of stock</span>
          )}
        </div></Link>
      ))}
    </div>
  </div>
);
}

export default Products;