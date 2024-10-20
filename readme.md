# bookstore app 

### app.jsx

```
import React, { useEffect } from 'react'
import Home from "./pages/Home";
import Navbar from './components/navbar/Navbar';
import { Routes, Route } from 'react-router-dom';
import AllBook from './pages/AllBook';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Footer from './components/Footer/Footer';
import VeiwBookDetails from './components/VeiwBookDetails/VeiwBookDetails';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from './Store/auth';
import Favorites from './components/Profile/Favorites';
import UserOrderHistory from './components/Profile/UserOrderHistory';
import Settings from './components/Profile/Settings';
 
const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) =>state.auth.role);
  useEffect(()=>{
    if(
      localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("role")
    ){
      dispatch(authActions.LogIn());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  }, []);
  return (
    <div>
    
        <Navbar />  {/* navbar here  */}
        <Routes>
         <Route  exact path="/" element={< Home/>}/>
         <Route   path="/all-books" element={< AllBook/>}/>
         <Route  path="/Cart" element={< Cart/>}/>
        
         <Route  path="/Profile" element={< Profile/>} >
         <Route index  element={<Favorites /> } />
         <Route path="/Profile/orderHistory" element={<UserOrderHistory />} />
         <Route path="/Profile/settings" element={<Settings />} />
         </Route>

         <Route  path="/SignUp" element={< SignUp/>}/>
         <Route  path="/LogIn" element={< LogIn/>}/>
         <Route path="view-book-details/:id" element={<VeiwBookDetails />} />
        </Routes>
        <Footer />  {/*Footer here  */}
 
     
    </div>
  )
}

export default App

```
# components
## Bookcard.jsx
``` 
import React from 'react'
import {Link} from 'react-router-dom';
const BookCard = ({data}) => {
  // console.log(data);
  return (
    <>
    <Link to={`/view-book-details/${data._id}`} >
    <div className='bg-zinc-800 p-4'>
      <div className=' bg-zinc-900'>
        <img src="{data.url}" alt="/" className='h-[25vh]'/>
      </div>
      <h2 className='mt-4 text-xl  text-white font-semibold '> {data.title}</h2>
      <p className='mt-2 text-zinc-200 font-semibold'>by {data.author} </p>
      <p className='mt-2 text-zinc-200 font-semibold text-xl'>₹ {data.price} </p>

      </div>
    </Link>
    </>
  );
}

export default BookCard


```

## home folder in hero.jsx 

# hero.jsx

``` 
import React from 'react'
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className=' h-[75vh]  flex flex-col md:flex-row items-center justify-center '>
       <div className='w-full mb-12 md:mb-0 lg:w-3/6 flex flex-col items-center lg:items-start justify-center' >
        <h1 className=' text-4xl gap -2 lg:text-6xl font-semibold text-yellow-200 text-center lg:text-left '>Discover your Next Great  Read </h1>
       <p className='mt-4 text-zinc-300 text-xl text-center lg:text-left  '>Lorem ipsum, dolor sit amet consectetur adipisicing elit. At unde est quis quae iusto? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque ab!</p>
       <div className=' mt-8'>
       <Link to={"/all-books"}  className='text-yellow-200 
       text-xl lg:text-2xl font-semibold border border-y-red-200 px-10 py-3  hover:bg-zinc-800 rounded-full'>DISCOVER BOOKS</Link> 
       </div>
       
       </div> 
       <Link to={"/all-books"} className='w-3/6 h-auto lg:h-[100%] flex items-center justify-center'>
       <img src="./new.avif" alt="hero" />
       </Link>

    </div>
  )
}

export default Hero
```


 # check code of orderhistory 
``` useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:1000/api/v1/get-order-history", { headers });
        setOrders(response.data.data || []);
      } catch (err) {   
        console.error("Error fetching order history:", err);
      }
    };
    fetchOrders();
  }, [headers]);




    useEffect(() => {
    const fetch = async () => {
      const response = await axios.get("http://localhost:1000/api/v1/get-order-history",{headers}
      );
      console.log(response);
      
    }
    fetch();
  }, [headers])
```
## order hitory data api ui 

``` 
 {OrderHistory.map((items, i) => (
        <div className=" bg-zinc-800 w-full rounded py-2 px-4 flex gap-4 hover:bg-zinc-900 hover:cursor-pointer">
          <div className="w-[3%]">
            <h1 className="text-center">{i + 1} </h1>
          </div>
          <div className="w-[22%]">
            <Link
              to={`/view-book-details/${items.book._id}`}
              className="hover:text-blue-300"
            ></Link>
          </div>
          <div className="w-[45%]">
            <h1 className="">{items.book.desc.slice(0, 50)}... </h1>
          </div>
          <div className="w-[9%]">
            <h1 className="">₹ {items.book.price}</h1>
          </div>
          <div className="w-[16%]">
            <h1 className="font-semibold text-green-500 ">
              {items.status === "Order Placed" ? (
                <div className="text-yellow-50">{items.status}</div>
              ) : items.status === " cancelled" ? (
                <div className="text-red-500">{items.status} </div>
              ) : (
                items.status
              )}
            </h1>
          </div>
          <div className="w-none md:w-[5%] hidden md:block">
            <h1 className=" text-sm text-zinc-400">COD </h1>
          </div>
        </div>
      ))}
```

## userOrderHistor component 

```
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";

const UserOrderHistory = () => {

  const [OrderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-order-history",
          { headers }
        );
        setOrderHistory(response.data.data);
        console.log(response.data);
         // Adjust according to your data structure
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [headers]);

  if (loading) return <Loader />;

  if (error) return <div>Error: {error}</div>;
  

  return (
   
 <>
    
 {!OrderHistory && (
   <div className="flex justify-center items-center h-[100%]">
     {" "}
     <Loader />{" "}
   </div>
 )}
 {OrderHistory && OrderHistory.length === 0 && (
   <div className="h-[80vh] p-4 text-zinc-100">
     <div className=" h-[100%] flex flex-col items-center justify-center   ">
       <h1 className="text-5xl font-semibold text-zinc-500 mb-8">
         {" "}
         NO Order History
       </h1>
       <img src="/empty.svg" alt="nohistory" className="h-[35vh] mb-0" />
     </div>
   </div>
 )}

 {OrderHistory && OrderHistory.length > 0 && (
   <div className=" p-0 md:p-4 text-zinc-100 w-[100%] ">
     <h1 className=" text-3xl md:text-5xl font-semibold text-zinc-500 mb-4">
       Your Order History
     </h1>
     <div className=" mt-4 bg-zinc-800 w-full rounded py-3 px-4 flex gap-3  ">
       <div className="w-[3%]">
         <h1 className="text-center">Sr. </h1>
       </div>
       <div className="w-[22%]">
         <h1 className=""> Books</h1>
       </div>
       <div className="w-[45%]">
         <h1 className="">Description </h1>
       </div>
       <div className="w-[9%]">
         <h1 className=""> Price </h1>
       </div>
       <div className="w-[16%]">
         <h1 className=""> Status </h1>
       </div>
       <div className="w-none md:w-[5%] hidden md:block ">
         <h1 className=""> Mode</h1>
       </div>
     </div>
   </div>
 )}

 {Array.isArray(OrderHistory) ? (
   OrderHistory.map((items, i) => (
     <div
       key={items.book._id} // Unique key for each item
       className="bg-zinc-800 w-full rounded py-2 px-4 flex gap-4 hover:bg-zinc-900 hover:cursor-pointer"
     >
       <div className="w-[3%]">
         <h1 className="text-center">{i + 1}</h1>
       </div>
       <div className="w-[22%]">
         <Link
           to={`/VeiwBookDetails/${items.book._id}`} // Correct link
           className="hover:text-blue-300"
         >
           View Details
         </Link>
       </div>
       <div className="w-[45%]">
         <h1>{items.book.desc.slice(0, 50)}...</h1>
       </div>
       <div className="w-[9%]">
         <h1>{items.book.price}</h1>
       </div>
       <div className="w-[16%]">
         <h1 className="font-semibold text-green-500">
           {items.status === "Order Placed" ? (
             <span className="text-yellow-50">{items.status}</span>
           ) : items.status === "cancelled" ? (
             <span className="text-red-500">{items.status}</span>
           ) : (
             items.status
           )}
         </h1>
       </div>
       <div className="w-none md:w-[5%] hidden md:block">
         <h1 className="text-sm text-zinc-400">COD</h1>
       </div>
     </div>
   ))
 ) : (
   <div>Loading or no data available...</div>
 )} 
</>
);
};


export default UserOrderHistory
```