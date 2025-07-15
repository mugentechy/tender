import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { updateTender, tenderdetailsquery } from "../../api/tender";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetMyDetails } from "../../api/user";

import Loading from "../utils/Loading";

const UpdateTender = () => {
  const { tenderId } = useParams();
  const {
    data: tenderDetails,
    isLoading,
    isError,
  } = tenderdetailsquery(tenderId);
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = GetMyDetails();

  const [tenderName, setTenderName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(0);
  const [category, setCategory] = useState("");
  const [document, setDocument] = useState(null);
  const [tenderImage, setTenderImage] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  let navigate = useNavigate();
  const showToast = (message, type = "error") => {
    toast[type](message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  useEffect(() => {
    if (!isLoading && !isError && tenderDetails) {
      const { title, description, cost, category,imageUrl } = tenderDetails;
      setTenderName(title || "");
      setDescription(description || "");
      setCost(parseFloat(cost) || 0);
      setCategory(category || "");
      setTenderImage(imageUrl || "");
    }
  }, [tenderDetails, isLoading, isError]);

  if (isLoading || loadingUpdate || userLoading) {
    return (
      <div style={{ minHeight: "800px", minWidth: "1200px" }}>
        <Loading />
      </div>
    );
  }

  if (isError || userError) {
    return <div>Error loading data.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedTender = {
      title: tenderName,
      description,
      cost: parseFloat(cost),
      category,
      imageUrl: tenderImage,
    };
    try {
      setLoadingUpdate(true);
      const result = await updateTender(tenderId, updatedTender);

      if (result.success) {
        setTenderName("");
        setDescription("");
        setCost(0);
        setCategory("");
        setDocument(null);
        setTenderImage(null);
        showToast("Tender Updated Successfully", "success");
        navigate("/myprofile");
      }
    } catch (error) {
      console.error(result.message);
      showToast("Some Error occurred in updating tender", "error");
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <div>
      <Navbar user={user} />

      <div className="bg-gray-200 min-h-[90vh] flex flex-col items-center justify-center">
        <div className="bg-white p-8 h-[87.5vh] rounded-lg shadow-md w-full max-w-lg">
          <h1 className="text-2xl font-semibold text-center text-gray-900 mb-4">
            Update Tender
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="tenderName"
                className="block text-gray-700 text-sm font-bold"
              >
                Tender Name
              </label>
              <input
                type="text"
                id="tenderName"
                className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                value={tenderName}
                onChange={(e) => setTenderName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 text-sm font-bold"
              >
                Tender Description
              </label>
              <textarea
                id="description"
                rows="4"
                className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="cost"
                className="block text-gray-700 text-sm font-bold"
              >
                Cost
              </label>
              <input
                type="number" // Change input type to number
                id="cost"
                className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="category"
                className="block text-gray-700 text-sm font-bold"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="tenderImage"
                className="block text-gray-700 text-sm font-bold"
              >
                Image Url
              </label>
              <input
                type="text"
                id="tenderImage"
                className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
                value={tenderImage}
                onChange={(e) => setTenderImage(e.target.value)}
                required
              />
            </div>
            {/* <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-gray-700 text-sm font-bold"
              >
                Tender Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setTenderImage(e.target.files[0])}
                className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="document"
                className="block text-gray-700 text-sm font-bold"
              >
                Upload Document
              </label>
              <input
                type="file"
                id="document"
                accept=".pdf, .doc, .docx"
                onChange={(e) => setDocument(e.target.files[0])}
                className="w-full py-2 px-3 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div> */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Update Tender
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateTender;
