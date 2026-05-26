import React, { useState } from "react";
import "./App.css";

function App() {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    isDelivery: false,
  });

  const [pizzaOrder, setPizzaorder] = useState({
    size: "medium",
    crust: "regular",
    toppings: [],
    specialInstructions: "",
  });

  const [formState, setFormState] = useState({
    error: {},
    isSubmitting: false,
    showOrderSummary: false,
  });

  const calculateTotalprice=()=>{
    let total =0;
    const sizePrices = {
      small: 12.99,
      medium: 15.99,
      large: 18.99,
      xlarge: 21.99
    };


    total+= sizePrices[pizzaOrder.size];


    const crustPrices ={
      regular: 0,
      thin:1,
      thick:2,
      stuffed: 3
    }

    total+= crustPrices[pizzaOrder.crust];


    total+= pizzaOrder.toppings.length * 1.5;

    if(customerInfo.isDelivery){
      total+= 2.99;
    }

     return total.toFixed(2);
  }

  return (
    <div className="App">
      <header>
        <h1>Mario's Pizza - Online Ordering</h1>
        <p>Authentic Brooklyn Pizza Since 1952</p>
      </header>
      <main>
        <form className="pizza-order-form">
          <h2>Place your order</h2>
          <section className="customer-info">
            <h3>Customer Info</h3>
            <div className="form-group">
              <label htmlFor="customer-name">Full Name</label>
              <input
                type="text"
                id="customer-name"
                name="name"
                value={customerInfo.name}
                onChange={(e) =>
                  setCustomerInfo({
                    ...customerInfo,
                    name: e.target.value,
                  })
                }
                placeholder="Enter yor full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customer-phone">Phone Number</label>
              <input
                type="tel"
                id="customer-phone"
                name="phone"
                value={customerInfo.phone}
                onChange={(e) =>
                  setCustomerInfo({
                    ...customerInfo,
                    phone: e.target.value,
                  })
                }
                placeholder="(555) 123-4567"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="customer-email">Email address</label>
              <input
                type="email"
                id="customer-email"
                name="email"
                value={customerInfo.email}
                onChange={(e) =>
                  setCustomerInfo({
                    ...customerInfo,
                    email: e.target.value,
                  })
                }
                placeholder="your.eamil@eaxample.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="customer-address">Delivery address</label>
              <textarea
                id="customer-address"
                name="address"
                value={customerInfo.address}
                onChange={(e) =>
                  setCustomerInfo({
                    ...customerInfo,
                    address: e.target.value,
                  })
                }
                placeholder="Enter your address..."
                rows={3}
                required
              />
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Order Type</legend>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="orderType"
                      value="delivery"
                      checked={customerInfo.isDelivery === true}
                      onChange={() =>
                        setCustomerInfo({
                          ...customerInfo,
                          isDelivery: true,
                        })
                      }
                    />
                    Delivery(45-60 minutes)
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="orderType"
                      value="pickup"
                      checked={customerInfo.isDelivery === false}
                      onChange={() =>
                        setCustomerInfo({
                          ...customerInfo,
                          isDelivery: false,
                        })
                      }
                    />
                    Pick up
                  </label>
                </div>
              </fieldset>
            </div>
          </section>

          <section className="pizza-customization">
            <h3>Build your pizza</h3>
            <div className="form-group">
              <label htmlFor="pizza-size">Pizza Size</label>
              <select
                id="pizz-size"
                name="size"
                value={pizzaOrder.size}
                onChange={(e) =>
                  setPizzaorder({
                    ...pizzaOrder,
                    size: e.target.value,
                  })
                }
              >
                <option value="small">Small 10" - $12.99</option>
                <option value="medium">Medium 12" - $15.99</option>
                <option value="large">Large 14" - $18.99</option>
                <option value="xlarge">Extra Large 16" - $21.99</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="pizza-crust">Pizza Crust</label>
              <select
                id="pizza-crust"
                name="crust"
                value={pizzaOrder.crust}
                onChange={(e) =>
                  setPizzaorder({
                    ...pizzaOrder,
                    crust: e.target.value,
                  })
                }
              >
                <option value="regular">Regular Crust</option>
                <option value="thin">Thin Crust (+$1.00)</option>
                <option value="thick">Thick Crust (+$2.00)</option>
                <option value="stufffed">Stuffed Crust (+$3.00)</option>
              </select>
            </div>
            <div className="form-group">
              <fieldset>
                <legend>Your Toppings (Each +$1.50)</legend>
                <div className="toppings-grid">
                  {[
                    "pepperoni",
                    "sausage",
                    "mushrooms",
                    "green peppers",
                    "onions",
                    "black olives",
                    "extra chesse",
                    "bacon",
                    "ham",
                    "pineapple",
                    "jalapenos",
                    "tomatoes",
                  ].map((topping) => (
                    <label key={topping} className="topping-option">
                      <input
                        type="checkbox"
                        name="toppings"
                        value={topping}
                        checked={pizzaOrder.toppings.includes(topping)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPizzaorder({
                              ...pizzaOrder,
                              toppings: [...pizzaOrder.toppings, topping],
                            });
                          } else {
                            setPizzaorder({
                              ...pizzaOrder,
                              toppings: pizzaOrder.toppings.filter(
                                (t) => t !== topping,
                              ),
                            });
                          }
                        }}
                      />
                      {topping.charAt(0).toUpperCase() + topping.slice(1)}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </section>

          <section className="order-summary">
            <h3>Order Summary</h3>
          </section>

          <button type="submit" className="submit-btn">Place Order - ${calculateTotalprice()}</button>
        </form>
      </main>
    </div>
  );
}
export default App;
