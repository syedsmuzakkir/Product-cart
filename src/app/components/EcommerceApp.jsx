import React, { useState, useEffect, useRef } from "react";
import { 
  ShoppingCart, User, Search, Star, Heart, Filter, 
  CreditCard, Package, History, Home, Grid, List, 
  Plus, Minus, X, Check, ArrowLeft, LogOut, Settings, 
  UserCircle, HelpCircle, Truck, MapPin, CreditCard as PaymentIcon, 
  Box, CheckCircle, ChevronRight, ChevronUp
} from "lucide-react";

export default function EcommerceApp() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [currentView, setCurrentView] = useState("products");
  const [viewMode, setViewMode] = useState("grid");
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStep, setPaymentStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    address: "123 Main Street",
    city: "New York",
    zipCode: "10001",
    cardNumber: "**** **** **** 1234",
    expiryDate: "12/25",
    cvv: "***"
  });
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [trackingId, setTrackingId] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const modalRef = useRef(null);
  const profileRef = useRef(null);
  const mainRef = useRef(null);

  // Dummy user data
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    joinDate: "Jan 15, 2023",
    orders: 7,
    wishlist: 12
  };

  // Dummy tracking statuses
  const trackingStatuses = [
    { id: 1, status: "Order Placed", date: "2023-10-15", time: "10:30 AM", completed: true },
    { id: 2, status: "Payment Confirmed", date: "2023-10-15", time: "10:45 AM", completed: true },
    { id: 3, status: "Processing Order", date: "2023-10-15", time: "11:30 AM", completed: true },
    { id: 4, status: "Shipped", date: "2023-10-16", time: "09:15 AM", completed: true },
    { id: 5, status: "Out for Delivery", date: "2023-10-17", time: "08:00 AM", completed: false },
    { id: 6, status: "Delivered", date: "", time: "", completed: false }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetch("https://dummyjson.com/products?limit=50");
        const productsData = await productsRes.json();
        
        // Extract unique categories from products
        const uniqueCategories = [...new Set(productsData.products.map(product => product.category))];
        
        setProducts(productsData.products);
        setCategories(uniqueCategories);
        setLoading(false);
        
        // Generate some order history
        const orders = productsData.products.slice(0, 3).map((product, index) => ({
          id: `ORD-${Date.now()}-${index}`,
          items: [{...product, quantity: index + 1}],
          total: product.price * (index + 1),
          date: new Date(Date.now() - (index * 2 * 24 * 60 * 60 * 1000)).toISOString(),
          status: index === 0 ? "Delivered" : index === 1 ? "Shipped" : "Processing",
          customerInfo: { 
            name: "Alex Johnson",
            address: "123 Main Street",
            city: "New York",
            zipCode: "10001"
          },
          trackingId: `TRK-${Date.now().toString().slice(-8)}-${index}`
        }));
        setOrderHistory(orders);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close product modal if clicked outside
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedProduct(null);
        setShowProductModal(false);
      }
      
      // Close profile dropdown if clicked outside
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleQuantityChange = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleCheckout = () => {
    setShowPaymentScreen(true);
    setPaymentStep(1);
  };

  const confirmPayment = () => {
    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-8)}`,
      items: cart,
      total: totalPrice,
      date: new Date().toISOString(),
      status: "Processing",
      customerInfo: { ...customerInfo },
      trackingId: `TRK-${Date.now().toString().slice(-8)}`
    };
    setOrderHistory((prev) => [newOrder, ...prev]);
    setCart([]);
    setShowPaymentScreen(false);
    setShowOrderSummary(true);
    setPaymentStep(1);
    setTimeout(() => setShowOrderSummary(false), 5000);
  };

  const trackOrder = () => {
    // Find order by tracking ID
    const order = orderHistory.find(order => order.trackingId === trackingId);
    if (order) {
      setTrackingOrder(order);
      setCurrentView("tracking");
    } else {
      alert("Order not found. Please check your tracking ID.");
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const renderHeader = () => (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50 transition-all duration-300">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <h1 
              onClick={() => setCurrentView("products")} 
              className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              ShopMart
            </h1>
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => setCurrentView("products")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-300 ${
                  currentView === "products" 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Home size={16} />
                <span>Products</span>
              </button>
              <button
                onClick={() => setCurrentView("history")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-300 ${
                  currentView === "history" 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <History size={16} />
                <span>Orders</span>
              </button>
              <button
                onClick={() => {
                  setTrackingOrder(null);
                  setCurrentView("tracking");
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-300 ${
                  currentView === "tracking" 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Truck size={16} />
                <span>Track Order</span>
              </button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-40 md:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
              />
            </div>
            
            <button
              onClick={() => setCurrentView("cart")}
              className="relative p-2 text-gray-700 hover:text-gray-900 transition-all duration-300"
            >
              <ShoppingCart size={20} className="transition-transform duration-300 hover:scale-110" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
            
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="p-2 text-gray-700 hover:text-gray-900 transition-all duration-300"
              >
                <User size={20} className="transition-transform duration-300 hover:scale-110" />
              </button>
              
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 border border-gray-200 animate-fadeIn">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
                        <UserCircle className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{userData.name}</p>
                        <p className="text-sm text-gray-500">{userData.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <p className="text-lg font-bold text-blue-600">{userData.orders}</p>
                        <p className="text-xs text-gray-600">Orders</p>
                      </div>
                      <div className="bg-pink-50 p-3 rounded-lg text-center">
                        <p className="text-lg font-bold text-pink-600">{userData.wishlist}</p>
                        <p className="text-xs text-gray-600">Wishlist</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setCurrentView("history");
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-300"
                    >
                      <History size={16} className="text-gray-500" />
                      <span>Order History</span>
                    </button>
                    
                    <button 
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setTrackingOrder(null);
                        setCurrentView("tracking");
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-300"
                    >
                      <Truck size={16} className="text-gray-500" />
                      <span>Track Orders</span>
                    </button>
                    
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-300">
                      <Settings size={16} className="text-gray-500" />
                      <span>Account Settings</span>
                    </button>
                  </div>
                  
                  <div className="p-2 border-t border-gray-100">
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-300">
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile search button */}
            <button 
              onClick={() => setSearch("")}
              className="sm:hidden p-2 text-gray-700 hover:text-gray-900"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
        
        {/* Mobile search bar */}
        <div className={`mt-3 sm:hidden transition-all duration-300 ${search === "" ? "max-h-0 opacity-0" : "max-h-12 opacity-100"}`}>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </header>
  );

  const renderBreadcrumbs = () => {
    let crumbs = [];
    
    if (currentView === "products") {
      crumbs = ["Home", "Products"];
    } else if (currentView === "cart") {
      crumbs = ["Home", "Shopping Cart"];
    } else if (currentView === "history") {
      crumbs = ["Home", "Orders"];
    } else if (currentView === "tracking") {
      crumbs = trackingOrder ? 
        ["Home", "Track Order", `Order ${trackingOrder.id}`] : 
        ["Home", "Track Order"];
    }
    
    return (
      <div className="flex items-center text-sm text-gray-600 mb-4">
        {crumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span 
              className={`cursor-pointer hover:text-blue-600 ${index === crumbs.length - 1 ? "font-medium text-gray-900" : ""}`}
            >
              {crumb}
            </span>
            {index < crumbs.length - 1 && <ChevronRight className="mx-2" size={14} />}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderFilters = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-indigo-600" />
          <span className="font-medium text-gray-700 hidden sm:block">Filters:</span>
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-indigo-400 text-sm sm:text-base"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-indigo-400 text-sm sm:text-base"
        >
          <option value="default">Sort By</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="name">Name</option>
        </select>
        
        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition-all duration-300 ${
              viewMode === "grid" 
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" 
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded transition-all duration-300 ${
              viewMode === "list" 
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" 
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderProductCard = (product) => (
    <div 
      key={product.id} 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-1 group"
    >
      <div 
        className="relative aspect-square cursor-pointer"
        onClick={() => {
          setSelectedProduct(product);
          setShowProductModal(true);
        }}
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
            wishlist.find((item) => item.id === product.id)
              ? "bg-red-500 text-white shadow-lg animate-pulse"
              : "bg-white text-gray-400 hover:text-red-500 shadow-md"
          }`}
        >
          <Heart size={16} fill={wishlist.find((item) => item.id === product.id) ? "currentColor" : "none"} />
        </button>
        {product.discountPercentage > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-bounce">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
      </div>
      
      <div className="p-3 sm:p-4">
        <h3 
          className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300 cursor-pointer"
          onClick={() => {
            setSelectedProduct(product);
            setShowProductModal(true);
          }}
        >
          {product.title}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating) 
                  ? "text-yellow-400 fill-current" 
                  : "text-gray-300"
                }
              />
            ))}
            <span className="ml-1 text-xs text-gray-500">({product.rating})</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-base sm:text-lg font-bold text-gray-900">${product.price}</span>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-gray-500 line-through">
                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-xs sm:text-sm text-green-600 font-medium">In Stock</span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product);
            }}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-xs sm:text-sm"
          >
            Add to Cart
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
              setShowProductModal(true);
            }}
            className="px-2 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-300 hover:border-indigo-400 text-xs sm:text-sm"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );

  const renderProductModal = () => {
    if (!selectedProduct) return null;
    
    const cartItem = cart.find(item => item.id === selectedProduct.id);
    const isInWishlist = wishlist.find(item => item.id === selectedProduct.id);
    
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div 
          ref={modalRef}
          className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scaleIn"
        >
          <div className="relative">
            <button
              onClick={() => {
                setSelectedProduct(null);
                setShowProductModal(false);
              }}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg z-10 hover:bg-gray-100 transition-colors duration-300"
            >
              <X size={24} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6">
              <div className="relative">
                <div className="aspect-square w-full">
                  <img
                    src={selectedProduct.thumbnail}
                    alt={selectedProduct.title}
                    className="w-full h-full object-contain rounded-xl bg-gray-100 p-4"
                  />
                </div>
                <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md border border-gray-200 p-1">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">{selectedProduct.title}</h2>
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(selectedProduct.rating) 
                          ? "text-yellow-400 fill-current" 
                          : "text-gray-300"
                        }
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">({selectedProduct.rating})</span>
                  </div>
                  <span className="mx-4 text-gray-300">|</span>
                  <span className="text-sm text-green-600 font-medium">In Stock</span>
                </div>
                
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{selectedProduct.description}</p>
                
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">${selectedProduct.price}</span>
                    {selectedProduct.discountPercentage > 0 && (
                      <span className="text-lg text-gray-500 line-through">
                        ${(selectedProduct.price / (1 - selectedProduct.discountPercentage / 100)).toFixed(2)}
                      </span>
                    )}
                    {selectedProduct.discountPercentage > 0 && (
                      <span className="text-sm sm:text-base font-bold text-red-600">
                        {Math.round(selectedProduct.discountPercentage)}% OFF
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(selectedProduct.id, -1)}
                      disabled={!cartItem}
                      className="p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors duration-300"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 sm:px-4 min-w-[30px] text-center">
                      {cartItem ? cartItem.quantity : 0}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(selectedProduct.id, 1)}
                      className="p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!cartItem) {
                          handleAddToCart(selectedProduct);
                        }
                      }}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 shadow-md text-sm sm:text-base ${
                        cartItem
                          ? "bg-gray-200 text-gray-700"
                          : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white transform hover:-translate-y-0.5"
                      }`}
                      disabled={cartItem}
                    >
                      {cartItem ? "In Cart" : "Add to Cart"}
                    </button>
                    
                    <button
                      onClick={() => toggleWishlist(selectedProduct)}
                      className={`p-2 sm:p-3 rounded-lg flex items-center justify-center ${
                        isInWishlist
                          ? "text-red-500 bg-red-100"
                          : "text-gray-500 bg-gray-100 hover:bg-gray-200"
                      } transition-colors duration-300`}
                    >
                      <Heart size={18} fill={isInWishlist ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                  <h3 className="font-semibold text-base sm:text-lg mb-2">Product Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div className="text-gray-600">Brand</div>
                    <div className="font-medium">{selectedProduct.brand}</div>
                    <div className="text-gray-600">Category</div>
                    <div className="font-medium capitalize">{selectedProduct.category}</div>
                    <div className="text-gray-600">Stock</div>
                    <div className="font-medium">{selectedProduct.stock} units</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProducts = () => (
    <div className="space-y-6">
      {renderBreadcrumbs()}
      {renderFilters()}
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 animate-pulse">Loading products...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Products ({sortedProducts.length})</h2>
            <div className="text-sm text-gray-600">
              Showing {Math.min(sortedProducts.length, visibleProducts)} of {sortedProducts.length} products
            </div>
          </div>
          
          <div className={`grid gap-4 sm:gap-6 ${
            viewMode === "grid" ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"
          }`}>
            {sortedProducts.slice(0, visibleProducts).map(renderProductCard)}
          </div>
          
          {visibleProducts < sortedProducts.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleProducts(prev => prev + 12)}
                className="bg-white border border-gray-300 hover:border-indigo-400 text-gray-700 px-6 py-3 rounded-md transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Load More Products
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderCart = () => (
    <div className="space-y-6">
      {renderBreadcrumbs()}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Shopping Cart</h2>
        <button
          onClick={() => setCurrentView("products")}
          className="flex items-center space-x-1 sm:space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-300 text-sm sm:text-base"
        >
          <ArrowLeft size={16} />
          <span>Continue Shopping</span>
        </button>
      </div>
      
      {cart.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-4 sm:mb-6">Add some products to get started!</p>
          <button
            onClick={() => setCurrentView("products")}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cart.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-3 sm:p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm sm:text-base">{item.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">{item.category}</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-300"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-300"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="p-1 sm:p-2 text-red-500 hover:text-red-700 transition-colors duration-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm h-fit sticky top-24 transition-all duration-300 hover:shadow-md">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Order Summary</h3>
            <div className="space-y-2 mb-3 sm:mb-4">
              <div className="flex justify-between text-sm sm:text-base">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Tax</span>
                <span>${(totalPrice * 0.1).toFixed(2)}</span>
              </div>
              <hr className="my-2 sm:my-3 border-gray-200" />
              <div className="flex justify-between font-bold text-base sm:text-lg">
                <span>Total</span>
                <span>${(totalPrice * 1.1).toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 sm:py-3 rounded-md font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              Proceed to Checkout
            </button>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2 text-sm sm:text-base">Secure Payment</h4>
              <div className="flex space-x-2">
                <div className="bg-white p-2 rounded border border-gray-200">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-5" />
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-5" />
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPaymentScreen = () => (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Checkout</h2>
          <button
            onClick={() => setShowPaymentScreen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all duration-300 text-xs sm:text-base ${
              paymentStep >= 1 
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" 
                : "bg-gray-200"
            }`}>
              1
            </div>
            <div className={`h-1 w-8 sm:w-16 transition-all duration-300 ${
              paymentStep >= 2 
                ? "bg-gradient-to-r from-blue-500 to-indigo-600" 
                : "bg-gray-200"
            }`}></div>
            <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all duration-300 text-xs sm:text-base ${
              paymentStep >= 2 
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" 
                : "bg-gray-200"
            }`}>
              2
            </div>
            <div className={`h-1 w-8 sm:w-16 transition-all duration-300 ${
              paymentStep >= 3 
                ? "bg-gradient-to-r from-blue-500 to-indigo-600" 
                : "bg-gray-200"
            }`}></div>
            <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all duration-300 text-xs sm:text-base ${
              paymentStep >= 3 
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" 
                : "bg-gray-200"
            }`}>
              3
            </div>
          </div>
        </div>
        
        {paymentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-indigo-400 text-sm sm:text-base"
              />
              <input
                type="email"
                placeholder="Email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-indigo-400 text-sm sm:text-base"
              />
            </div>
            <input
              type="text"
              placeholder="Address"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-indigo-400 text-sm sm:text-base"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="City"
                value={customerInfo.city}
                onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-indigo-400 text-sm sm:text-base"
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={customerInfo.zipCode}
                onChange={(e) => setCustomerInfo({...customerInfo, zipCode: e.target.value})}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-indigo-400 text-sm sm:text-base"
              />
            </div>
            <button
              onClick={() => setPaymentStep(2)}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 sm:py-3 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              Continue to Payment
            </button>
          </div>
        )}
        
        {paymentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Payment Information</h3>
            <input
              type="text"
              placeholder="Card Number"
              value={customerInfo.cardNumber}
              onChange={(e) => setCustomerInfo({...customerInfo, cardNumber: e.target.value})}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-indigo-400 text-sm sm:text-base"
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                value={customerInfo.expiryDate}
                onChange={(e) => setCustomerInfo({...customerInfo, expiryDate: e.target.value})}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-indigo-400 text-sm sm:text-base"
              />
              <input
                type="text"
                placeholder="CVV"
                value={customerInfo.cvv}
                onChange={(e) => setCustomerInfo({...customerInfo, cvv: e.target.value})}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-indigo-400 text-sm sm:text-base"
              />
            </div>
            <div className="flex space-x-3 sm:space-x-4">
              <button
                onClick={() => setPaymentStep(1)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 sm:py-3 rounded-md transition-colors duration-300 text-sm sm:text-base"
              >
                Back
              </button>
              <button
                onClick={() => setPaymentStep(3)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 sm:py-3 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Review Order
              </button>
            </div>
          </div>
        )}
        
        {paymentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Order Review</h3>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-md">
              <h4 className="font-medium mb-2 text-sm sm:text-base">Items ({cart.length})</h4>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-1 sm:py-2 text-sm sm:text-base">
                  <span>{item.title} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr className="my-2 border-gray-200" />
              <div className="flex justify-between font-bold text-base sm:text-lg">
                <span>Total</span>
                <span>${(totalPrice * 1.1).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex space-x-3 sm:space-x-4">
              <button
                onClick={() => setPaymentStep(2)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 sm:py-3 rounded-md transition-colors duration-300 text-sm sm:text-base"
              >
                Back
              </button>
              <button
                onClick={confirmPayment}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 sm:py-3 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrderHistory = () => (
    <div className="space-y-6">
      {renderBreadcrumbs()}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Order History</h2>
      
      {orderHistory.length === 0 ? (
        <div className="text-center py-16">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-4 sm:mb-6">Start shopping to see your orders here!</p>
          <button
            onClick={() => setCurrentView("products")}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {orderHistory.map((order) => (
            <div 
              key={order.id} 
              className="bg-white p-4 sm:p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">Order #{order.id}</h3>
                  <p className="text-gray-600 text-sm">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="mt-2 sm:mt-0 sm:text-right">
                  <p className="font-bold text-lg">${(order.total * 1.1).toFixed(2)}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs sm:text-sm ${
                    order.status === "Delivered" ? "bg-green-100 text-green-800" :
                    order.status === "Shipped" ? "bg-blue-100 text-blue-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div>
                  <h4 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">Items</h4>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2 sm:space-x-3 mb-1 sm:mb-2">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-sm sm:text-base">{item.title}</p>
                        <p className="text-gray-600 text-xs sm:text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">Shipping Address</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {order.customerInfo.name}<br />
                    {order.customerInfo.address}<br />
                    {order.customerInfo.city}, {order.customerInfo.zipCode}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    setTrackingOrder(order);
                    setCurrentView("tracking");
                  }}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm sm:text-base"
                >
                  <Truck size={16} />
                  <span>Track Order</span>
                </button>
                <button
                  onClick={() => {
                    // Simulate reordering
                    setCart(order.items);
                    setCurrentView("cart");
                  }}
                  className="text-sm sm:text-base bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors duration-300"
                >
                  Reorder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTrackingView = () => (
    <div className="space-y-6">
      {renderBreadcrumbs()}
      
      {!trackingOrder ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Track Your Order</h2>
            <p className="text-gray-600 mb-6">
              Enter your order tracking ID below to check the status of your delivery. 
              You can find your tracking ID in your order confirmation email.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Tracking ID</label>
                <input
                  type="text"
                  placeholder="e.g. TRK-12345678"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={trackOrder}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-md font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Track Order
              </button>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                {orderHistory.slice(0, 3).map(order => (
                  <div 
                    key={order.id} 
                    className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setTrackingOrder(order);
                      setTrackingId(order.trackingId);
                    }}
                  >
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{order.trackingId}</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Order Tracking</h2>
                <p className="text-gray-600">Tracking ID: {trackingOrder.trackingId}</p>
              </div>
              <button
                onClick={() => setTrackingOrder(null)}
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <ArrowLeft size={16} />
                <span>Back to Tracking</span>
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <MapPin className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Delivery Address</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {trackingOrder.customerInfo.name}<br />
                      {trackingOrder.customerInfo.address}<br />
                      {trackingOrder.customerInfo.city}, {trackingOrder.customerInfo.zipCode}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Box className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Order Details</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Order #: {trackingOrder.id}<br />
                      Placed on: {new Date(trackingOrder.date).toLocaleDateString()}<br />
                      {trackingOrder.items.length} items
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <PaymentIcon className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Payment Method</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Credit Card ending in 1234<br />
                      Total: ${(trackingOrder.total * 1.1).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Delivery Status</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-8 pl-10">
                  {trackingStatuses.map((status, index) => (
                    <div key={status.id} className="relative">
                      <div className={`absolute left-[-23px] top-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        status.completed 
                          ? "bg-green-500 text-white" 
                          : "bg-white border-2 border-gray-300"
                      }`}>
                        {status.completed ? <CheckCircle size={16} /> : index + 1}
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex justify-between">
                          <h4 className={`font-medium ${
                            status.completed ? "text-green-600" : "text-gray-700"
                          }`}>
                            {status.status}
                          </h4>
                          <span className="text-sm text-gray-500">{status.date} {status.time}</span>
                        </div>
                        {status.id === 4 && (
                          <div className="mt-3 text-sm bg-blue-50 p-3 rounded border border-blue-100">
                            <p className="font-medium">Your package is on the way</p>
                            <p className="text-gray-600">Estimated delivery: Oct 17, 2023</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about your order, our customer service team is ready to help.
              </p>
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50" ref={mainRef}>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        /* Mobile-first responsive design */
        @media (max-width: 640px) {
          .product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        
        @media (max-width: 400px) {
          .product-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      {renderHeader()}
      
      {showOrderSummary && (
        <div className="fixed top-20 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg shadow-lg z-50 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Check size={20} />
            <span>Order placed successfully!</span>
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {showPaymentScreen ? (
          renderPaymentScreen()
        ) : (
          <>
            {currentView === "products" && renderProducts()}
            {currentView === "cart" && renderCart()}
            {currentView === "history" && renderOrderHistory()}
            {currentView === "tracking" && renderTrackingView()}
          </>
        )}
      </main>
      
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-full shadow-lg z-40 transition-all duration-300 hover:shadow-xl transform hover:scale-105"
        >
          <ChevronUp size={20} />
        </button>
      )}
      
      {showProductModal && renderProductModal()}
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ShopMart</h3>
            <p className="text-gray-400 mb-4">
              Your one-stop destination for all your shopping needs. Quality products at affordable prices.
            </p>
            <div className="flex space-x-4">
              <div className="bg-gray-800 p-2 rounded-full">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-6" />
              </div>
              <div className="bg-gray-800 p-2 rounded-full">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-6" />
              </div>
              <div className="bg-gray-800 p-2 rounded-full">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shop</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l focus:outline-none text-gray-800"
              />
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 rounded-r">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© 2023 ShopMart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}