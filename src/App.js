import "./css/App.css";
import { Stack, Button, Form, Table, ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Blocks, BallTriangle } from "react-loader-spinner";
import "./css/App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import {
  REACT_APP_BACKEND_URL,
  MAIN_PAGE_DASHBOARD_HEADERS,
  MAIN_PAGE_FAKE_DATA,
  DEVELOPMENT_PHASE,
  DARK_MODE_BTN,
} from "./dev_variables";
import Lottie from "react-lottie";
import not_found from "./lottie/not_found.json";
import { ToastContainer, toast } from "react-toastify";
import MainPageModal from "./components/mainPageModal";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { MdDelete, MdModeEdit } from "react-icons/md";
import { usePagination } from "./hooks/pagination";
import { TableRow } from "./components/TableActions";
import TypeFilter from "./components/TypeFilter";
import { RegulatorFilter } from "./components/RegulatorFilter";


const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const selectStyle = { ...inputStyle };

function App() {
  const [activeIndex, setActiveIndex] = useState({});
  const [data, setData] = useState(
    DEVELOPMENT_PHASE ? MAIN_PAGE_FAKE_DATA : []
  );
  const [modalInfo, setModalInfo] = useState({
    show: false
  });
  const [deleteModal, setDeleteModal] = useState({
    show: false
  });
  const [deleteManyModal, setDeleteManyModal] = useState({
    show: false,
    count: 0,
  });
  const [refreshData, setRefreshData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editSubdomainInfo, setEditSubdomainInfo] = useState({});
  const [selectedAllDomains, setSelectedAllDomains] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedRegulator, setSelectedRegulator] = useState('');

  const { 
    currentPage, 
    totalPages, 
    currentItems, 
    pagesAroundCurrent, 
    onPageChange 
  } = usePagination(data);
  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  useEffect(() => {
    for (let i = 0; i < data?.length; i++) {
      setActiveIndex((prev) => ({
        ...prev,
        [i]: activeIndex?.i ? activeIndex.i : false,
      }));
    }
  }, [data]);

  useEffect(() => {
    console.log('hello')
    setIsLoading(true);
    const getData = async () => {
      console.log('hi')
      try {
        const req = await fetch(REACT_APP_BACKEND_URL + "/documents/scraped-urls", {
          mode: "cors",
        });

        const {status, data} = await req.json()
        if (status) {
          setData(data)
          console.log(data)
        }
        console.log(status)
        setIsLoading(false);
      } catch (error) {
        console.log(error)
        toast.error(String(error));
      }
    };
    getData();
  }, [refreshData]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: not_found,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const selectDomain = (index) => {
    const newActiveIndex = { ...activeIndex, [index]: !activeIndex[index] };

    // Step 1: Get all entries [key, value] pairs
    const entries = Object.entries(newActiveIndex);

    // Step 2: Filter out entries where the value is not true
    const trueEntries = entries.filter(([key, value]) => value === true);
    setDeleteManyModal((prev) => ({
      ...prev,
      count: trueEntries.length,
    }));
    if (trueEntries.length === Object.keys(newActiveIndex).length) {
      setSelectedAllDomains(true);
    } else {
      setSelectedAllDomains(false);
    }
    setActiveIndex((prevActiveIndex) => ({
      ...prevActiveIndex,
      [index]: !prevActiveIndex[index],
    }));
  };

  const selectAllDomain = () => {
    Object.keys(activeIndex).forEach((key) => {
      setActiveIndex((prevActiveIndex) => ({
        ...prevActiveIndex,
        [key]: !selectedAllDomains,
      }));
    });
    setDeleteManyModal((prev) => ({
      ...prev,
      count: Object.keys(activeIndex).length,
    }));
    setSelectedAllDomains(!selectedAllDomains);
  };

  const handleShow = () => {
    console.log("changing modal show...")
    setModalInfo((prev) => ({
      ...prev,
      show: !modalInfo.show,
    }));
  };

  const handleDelete = (item) => {
    // Delete logic
  };

  const changeDeleteManySubdomainModal = () => {
    if (deleteManyModal.count < 1) {
      toast.error("No subdomain selected");
      return;
    }
    setDeleteManyModal((prev) => ({
      ...prev,
      show: !deleteManyModal.show,
    }));
  };

  const deleteSubdomain = async () => {
    const req = await fetch(
      `${REACT_APP_BACKEND_URL}/delete/subdomain/${deleteModal.subdomain_id}`
    );
    const { status, result } = await req.json();
    setRefreshData(!refreshData);
    setDeleteModal({ show: false, subdomain: null, subdomain_id: null });
    if (status) {
      toast.success("Deleted subdomain & subdomain urls");
      return;
    }
    toast.error(result);
  };

  const deleteManySubdomain = async () => {
    const subdomain_ids = [];
    for (let i = 0; i < data.length; i++) {
      if (activeIndex[i]) {
        subdomain_ids.push(data[i]["_id"]);
      }
    }
    if (subdomain_ids.length < 1) {
      toast.error("No subdomain selected");
      return;
    }
    let headers = new Headers();

    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    const req = await fetch(`${REACT_APP_BACKEND_URL}/delete/subdomains`, {
      method: "POST",
      body: JSON.stringify({ ids: subdomain_ids }),
      headers,
    });
    const { status, result } = await req.json();
    setRefreshData(!refreshData);
    changeDeleteManySubdomainModal();
    if (status) {
      setDeleteManyModal((prev) => ({
        ...prev,
        count: deleteManyModal.count - subdomain_ids.length,
      }));
      toast.success(result);
      return;
    }
    toast.error(result);
  };

  const handleEdit = (item) => {
    // Edit logic

  };

  return (
    <>
      <MainPageModal
        onSuccess={() => setRefreshData(!refreshData)}
        show={modalInfo.show}
        handleShow={handleShow}
        subdomainInfo={editSubdomainInfo}
        toast={toast}
      />
      <Stack
        gap={2}
        className="my-3 flex-column flex-sm-row jusity-content-between"
        direction="horizontal"
      >
        <Stack
          className="justify-content-between" // Adjust stack layout for small screens
          gap={2}
          direction="horizontal"
        >
         RegPass© Horizon Scanning
        </Stack>
        <Stack className="d-none d-md-block"></Stack>

        <Stack className="d-none d-md-block"></Stack>

        <Stack className="d-flex flex-row justify-content-between">
          <div className="d-none d-md-block w-100">
            <div className="d-flex align-items-center gap-4">
              <RegulatorFilter 
                style={selectStyle} 
                onSelect={setSelectedRegulator} 
              />

              <TypeFilter
                style={selectStyle} 
                onSelect={setSelectedType} 
              />

              <Button variant={`${DARK_MODE_BTN ? "dark" : "light"}`}>Filter</Button>
            </div>
          </div>

          <div className="d-block d-md-none w-100">
            <div className="d-flex flex-column gap-2">
              <RegulatorFilter 
                style={selectStyle} 
                onSelect={setSelectedRegulator} 
              />

              <TypeFilter
                style={selectStyle} 
                onSelect={setSelectedType} 
              />
              <Button variant={`${DARK_MODE_BTN ? "dark" : "light"}`}>Filter</Button>
            </div>
          </div>
        </Stack>

      </Stack>

      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              {MAIN_PAGE_DASHBOARD_HEADERS.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {
            isLoading ? (
              <tr>
                <td colspan="6" className="text-center align-middle">
                  <BallTriangle
                    height="80"
                    width="80"
                    color="#000"
                    ariaLabel="ball-triangle-loading"
                    wrapperStyle={{ display: "block" }}
                    wrapperClass="blocks-wrapper"
                    visible={true}
                  />
                </td>
              </tr>
            )
            : currentItems && currentItems.length > 0 ? 
              currentItems?.map((item, index) => (
                <TableRow 
                  key={index} 
                  item={item} 
                  index={index} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            :
            (
              <tr>
                <td colSpan={"6"}>
                  <h1 style={{ color:"#000" }} className="my-2 empty-records">
                    <b>No SEC Alerts Found</b>
                  </h1>
                  <Lottie
                    options={defaultOptions}
                    height={500}
                    width={500}
                    isClickToPauseDisabled={true}
                  />
                </td>
              </tr>
            )
          }
          </tbody>
        </Table>

        <div className="d-flex justify-content-end align-items-center w-100">
        <nav aria-label="Pagination">
          <ul className="pagination flex list-none gap-2">
            {/* Previous Button */}
            <li className={`page-item ${currentPage === 1 ? "disabled opacity-50" : ""}`}>
              <button
                className="page-link px-3 py-2 border rounded-lg bg-white text-gray-700 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            {/* Page Numbers */}
            {pagesAroundCurrent.map((page) => (
              <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                <button
                  className={`page-link px-3 py-2 border rounded-lg ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  } shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}

            {/* Next Button */}
            <li className={`page-item ${currentPage === totalPages ? "disabled opacity-50" : ""}`}>
              <button
                className="page-link px-3 py-2 border rounded-lg bg-white text-gray-700 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>    
      </div>

      <ToastContainer />
    </>
  );
}

export default App;
