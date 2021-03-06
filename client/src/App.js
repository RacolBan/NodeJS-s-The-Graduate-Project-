import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DataProvider } from "./GlobalState";
import defaultLayout from "./Layout/DefaultLayout/DefaultLayout";
import Admin from "./pages/Admin/Admin";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import DetailProduct from "./pages/DetailProduct/DetailProduct";
import Cart from "./pages/Cart/Cart";
import Profile from "./pages/Profile/Profile";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Reset from "./pages/Reset/Reset";
import {
  userInputs,
  productInputs,
  categoryInputs,
  manufactureInputs,
} from "./pages/Admin/formInput";
import AdminLayout from "./Layout/Admin/AdminLayout";
import {
  columnsUsers,
  columnsProducts,
  columnsCategory,
  columnsManufacture,
} from "./pages/Admin/Conponents/Table/Columns";
import { useEffect, useState } from "react";
import axios from "axios";
import NewCategory from "./pages/Admin/Conponents/New/NewCategory";
import Category from "./pages/Category/Category";
import NewManufacture from "./pages/Admin/Conponents/New/NewManufacture";
import NewProduct from "./pages/Admin/Conponents/New/NewProduct";
import NewUser from "./pages/Admin/Conponents/New/NewUser";
import ListUsers from "./pages/Admin/Conponents/List/ListUsers";
import ListProducts from "./pages/Admin/Conponents/List/ListProducts";
import ListCategory from "./pages/Admin/Conponents/List/ListCategory";
import ListManufacture from "./pages/Admin/Conponents/List/ListManufacture";
import ViewUser from "./pages/Admin/Conponents/View/ViewUser";
import ViewProduct from "./pages/Admin/Conponents/View/ViewProduct";
import { toast, ToastContainer } from "react-toastify";
import ViewCategory from "./pages/Admin/Conponents/View/ViewCategory";
import ViewManufacture from "./pages/Admin/Conponents/View/ViewManufacture";
import ProductsAll from "./API/ProductsAll";
import Search from "./pages/Search/Search";

function App() {
  const [categoryAll, setCategoryAll] = useState([]);
  const products = ProductsAll().productsAll;
  const [cartItems, setCartItems] = useState([]);
  const login = JSON.parse(localStorage.getItem("login")) || null;
  useEffect(() => {
    if (login) {
      const getCart = async () => {
        try {
          const { data } = await axios.get(
            `http://localhost:8000/cart/users/${login.userId}`
          );
          data.map((item) => {
            item.quantity = 1;
            return item;
          });
          setCartItems(data);
        } catch (error) {
          toast.error(error.response.data.message, {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      };
      getCart();
    }
  }, []);

  const handleAddProducts = async (product) => {
    if (login) {
      const checkExist = cartItems.find((item) => {
        return item.id === product.id;
      });
      if (checkExist) {
        return toast.warning("This product has been added to your cart", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        try {
          await axios.post(
            `http://localhost:8000/cart/users/${login.userId}/products/${product.id}`
          );
          setCartItems([...cartItems, { ...product, quantity: 1 }]);
        } catch (error) {
          toast.error(error.response.data.message, {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      }
    } else {
      toast.warning("Please login before taking this action");
    }
  };

  useEffect(() => {
    const getCategory = async () => {
      const { data } = await axios.get(`http://localhost:8000/category`);
      setCategoryAll(data);
    };
    getCategory();
  }, []);

  const Layout = defaultLayout;
  const LayoutAdmin = AdminLayout;
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout cartItems={cartItems}>
                <Home
                  categoryList={categoryAll}
                  handleAddProducts={handleAddProducts}
                />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/detail/:id"
            element={
              <Layout cartItems={cartItems}>
                <DetailProduct products={products} handleAddProducts={handleAddProducts}/>
              </Layout>
            }
          />
          <Route
            path="/category/:id"
            element={
              <Layout cartItems={cartItems}>
                <Category handleAddProducts={handleAddProducts}/>
              </Layout>
            }
          />
          <Route
            path="/cart"
            element={
              <Layout cartItems={cartItems}>
                <Cart cartItems={cartItems} setCartItems={setCartItems} />
              </Layout>
            }
          />
          <Route
            path="/search"
            element={
              <Layout>
                <Search handleAddProducts={handleAddProducts}/>
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout cartItems={cartItems}>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/changepass"
            element={
              <Layout>
                <ChangePassword />
              </Layout>
            }
          />
          <Route
            path="/forgot"
            element={
              <Layout>
                <ForgotPassword />
              </Layout>
            }
          />
          <Route
            path="/reset/:tempToken"
            element={
              <Layout>
                <Reset />
              </Layout>
            }
          />
          <Route
            path="/admin"
            element={
              <LayoutAdmin>
                <Admin />
              </LayoutAdmin>
            }
          />
          <Route path="admin/users">
            <Route
              index
              element={
                <LayoutAdmin>
                  <ListUsers columns={columnsUsers} title="Users" />
                </LayoutAdmin>
              }
            />
            <Route
              path="new"
              element={
                <LayoutAdmin>
                  <NewUser
                    inputs={userInputs}
                    title="Add New User"
                    isFile={true}
                  />
                </LayoutAdmin>
              }
            />
            <Route
              path="view/:id"
              element={
                <LayoutAdmin>
                  <ViewUser title="Update User" isFile={true} />
                </LayoutAdmin>
              }
            />
          </Route>
          <Route path="admin/products">
            <Route
              index
              element={
                <LayoutAdmin>
                  <ListProducts columns={columnsProducts} title="Products" />
                </LayoutAdmin>
              }
            />
            <Route
              path="new"
              element={
                <LayoutAdmin>
                  <NewProduct
                    inputs={productInputs}
                    title="Add New Product"
                    isFile={true}
                  />
                </LayoutAdmin>
              }
            />
            <Route
              path="view/:id"
              element={
                <LayoutAdmin>
                  <ViewProduct title="Update Product" isFile={true} />
                </LayoutAdmin>
              }
            />
          </Route>
          <Route path="admin/category">
            <Route
              index
              element={
                <LayoutAdmin>
                  <ListCategory
                    columns={columnsCategory}
                    title="Category"
                    categoryAll={categoryAll}
                    setCategoryAll={setCategoryAll}
                  />
                </LayoutAdmin>
              }
            />
            <Route
              path="new"
              element={
                <LayoutAdmin>
                  <NewCategory
                    inputs={categoryInputs}
                    title="Add New Category"
                    isFile={false}
                  />
                </LayoutAdmin>
              }
            />
            <Route
              path="view/:id"
              element={
                <LayoutAdmin>
                  <ViewCategory title="Update Category" isFile={false} />
                </LayoutAdmin>
              }
            />
          </Route>
          <Route path="admin/manufacture">
            <Route
              index
              element={
                <LayoutAdmin>
                  <ListManufacture
                    columns={columnsManufacture}
                    title="Manufacture"
                  />
                </LayoutAdmin>
              }
            />
            <Route
              path="new"
              element={
                <LayoutAdmin>
                  <NewManufacture
                    inputs={manufactureInputs}
                    title="Add New Manufacture"
                    isFile={false}
                  />
                </LayoutAdmin>
              }
            />
            <Route
              path="view/:id"
              element={
                <LayoutAdmin>
                  <ViewManufacture title="Update Manufacture" isFile={false} />
                </LayoutAdmin>
              }
            />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-center" newestOnTop />
    </DataProvider>
  );
}

export default App;
