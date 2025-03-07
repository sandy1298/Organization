import React, { useState, useEffect } from "react";
import AddEmployeeForm from "./components/AddEmployeeForm";
import OrganizationTree from "./components/OrganizationTree";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsAsync, selectPosts } from "./features/post/PostSlice";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Loader } from "./utils/Loader";

function App() {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const employees = useSelector(selectPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchPostsAsync()).then(() => setLoading(false));
  }, [dispatch]);

  const handleClose = () => setShow(false);

  return (
    <div className="app-container">
      <div className="button_align">
        <button className="button_custom" onClick={() => setShow(true)}>
          Add Employee
        </button>
      </div>
      <h1 className="title">Company Organization</h1>
      <AddEmployeeForm show={show} handleClose={handleClose} employees={employees} />
      {loading ?
        <Loader />
        :
        <OrganizationTree employees={employees} />
      }
    </div>
  );
}

export default App;
