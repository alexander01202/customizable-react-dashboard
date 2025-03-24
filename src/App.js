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
    setIsLoading(false);
    // const getData = async () => {
    //   try {
    //     const req  = await fetch(REACT_APP_BACKEND_URL + "/csvArticles")
    //     const {status, data} = await req.json()
    //     if (status) {
    //       setData(data)
    //     }
    //     setIsLoading(false);
    //   } catch (error) {
    //     toast.error(error);
    //   }
    // };
    // getData();
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

  const AddSubdomainInfoToModal = (location, subdomain_type, id, subdomain) => {
    setEditSubdomainInfo((prev) => ({
      ...prev,
      subdomain,
      location,
      subdomain_type,
      subdomain_id: id,
    }));
    handleShow();
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

  const openAddSubdomainModal = () => {
    setEditSubdomainInfo((prev) => ({
      ...prev,
      location: "",
      subdomain: "",
      subdomain_id: "",
      subdomain_type: "job",
    }));
    handleShow();
  };

  return (
    <>
      {/* <CenteredModal
        show={deleteModal.show}
        onSuccess={deleteSubdomain}
        onHide={() =>
          setDeleteModal({ show: false, subdomain: null, subdomain_id: null })
        }
        header={`Delete Subdomain?`}
        body={`Are you sure you want to delete <strong>${deleteModal.subdomain}</strong>? <br /> This would also delete all urls under this subdomain.`}
        successText="Yes, Delete."
      />
      <CenteredModal
        show={deleteManyModal.show}
        onSuccess={deleteManySubdomain}
        onHide={changeDeleteManySubdomainModal}
        header={`Delete Subdomains?`}
        body={`Are you sure you want to delete <strong>${deleteManyModal.count}</strong> subdomains? <br /> This would also delete all urls under these subdomains.`}
        successText="Yes, Delete."
      /> */}
      <MainPageModal
        onSuccess={() => setRefreshData(!refreshData)}
        show={modalInfo.show}
        handleShow={handleShow}
        subdomainInfo={editSubdomainInfo}
        toast={toast}
      />
      {/* <Stack gap={2} className='my-3' direction='horizontal'>
        <Stack className='justify-content-start' gap={2} direction='horizontal'>
          <Button onClick={() => setModalInfo({ show:true })} className='edit-btn' size="md" variant={`p-2 btn-${DARK_MODE_BTN ? 'dark' : 'light'}`}>Add new CSV Article</Button>
          <Button className='delete-btn' size="md" variant="p-2 btn-danger primary">Delete</Button>
        </Stack>
          <Form className="ms-auto d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2 main-input"
              aria-label="Search"
            />
            <Button variant={`${DARK_MODE_BTN ? 'dark' : 'light'}`}>Search</Button>
          </Form>
        </Stack> */}

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
          <Button
            onClick={() => setModalInfo({ show: true })}
            className="edit-btn"
            size="md"
            disabled='true'
            variant={`p-2 btn-${DARK_MODE_BTN ? "dark" : "light"}`}
          >
            Add New SEC ALERT
          </Button>
          <Button
            className="delete-btn"
            size="md"
            variant="p-2 btn-danger primary"
            disabled='true'
          >
            Delete
          </Button>
        </Stack>
        <Stack className="d-none d-md-block"></Stack>

        <Stack className="d-none d-md-block"></Stack>

        <Stack>
          <div className="d-none d-md-block">
            <Form className="ms-auto d-flex ">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 main-input]"
                aria-label="Search"
              />
              <Button variant={`${DARK_MODE_BTN ? "dark" : "light"}`}>
                Search
              </Button>
            </Form>
          </div>

          <div className="d-block d-md-none">
            <Form className="d-flex justify-content-center align-items-center">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 main-input"
                aria-label="Search"
                style={{ flex: "1" }} // Optional for better styling
              />
              <Button variant="dark" style={{ whiteSpace: "nowrap" }}>
                Search
              </Button>
            </Form>
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
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
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
            ) : data?.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="table_row urlsPage">
                  <td className="ellipsis">
                    <OverlayTrigger
                      placement='top'
                      overlay={
                        <Tooltip id={`tooltip-top`}>
                          <strong>{item['title']}</strong>
                        </Tooltip>
                      }
                    >
                      <span>{item["title"]}</span>
                    </OverlayTrigger>
                  </td>
                  <td>
                    <Link className="ellipsis" to={item["source"]} target="_blank" style={{ color: "blue", textDecoration:"underline" }}>
                      {item["source"]}
                    </Link>
                  </td>
                  <td style={{ alignContent:'center', textTransform:'capitalize' }}>
                    {item['type']}
                  </td>
                  <td>
                    {item['published']}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={{ background: "transparent" }} colSpan={"6"}>
                  <h1
                    className="my-2"
                    style={{
                      textTransform: "uppercase",
                      fontSize: "30px",
                      textAlign: "center",
                    }}
                  >
                    <b>No Data Found</b>
                  </h1>
                  <Lottie
                    options={defaultOptions}
                    height={500}
                    width={500}
                    isClickToPauseDisabled={true}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <ToastContainer />
    </>
  );
}

export default App;
