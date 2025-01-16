import Lottie from "react-lottie";
import not_found from "./lottie/not_found.json";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer, toast } from "react-toastify";
import "../node_modules/react-toastify/dist/ReactToastify.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { REACT_APP_BACKEND_URL } from "./dev_variables";
import { useState, useEffect } from "react";
import { Form, Table, Button, Stack } from "react-bootstrap";
import CenteredModal from "./components/centeredModal";
import { AdminModal } from "./components/adminModal";
import { Blocks, BallTriangle } from "react-loader-spinner";

export default function Admin() {
  const [admins, setAdmins] = useState([]);
  const [activeIndex, setActiveIndex] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshAdmins, setRefreshAdmins] = useState(false);
  const [AdminModalInfo, setAdminModalInfo] = useState({
    id: "",
    username: "",
    role: "",
    password: "",
    email: "",
    show: false,
  });
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    username: "",
    admin_id: "",
  });
  const [selectedAllDomains, setSelectedAllDomains] = useState(false);

  useEffect(() => {
    for (let i = 0; i < admins?.length; i++) {
      setActiveIndex((prev) => ({
        ...prev,
        [i]: activeIndex?.i ? activeIndex.i : false,
      }));
    }
  }, [admins]);

  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoading(true);
      const req = await fetch(`${REACT_APP_BACKEND_URL}/admins`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const { status, data } = await req.json();

      if (status) {
        setAdmins(data);
      } else {
        toast.error("An error occurred.");
      }
      setIsLoading(false);
    };
    fetchAdmins();
  }, [refreshAdmins]);

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
    setSelectedAllDomains(!selectedAllDomains);
  };

  const openAddAdminModal = () => {
    setAdminModalInfo((prev) => ({
      ...prev,
      username: "",
      role: "",
      password: "",
      id: "",
      email: "",
    }));
    handleAdminModalShow();
  };

  const addAdminInfoToModal = (id, role, password, email, username) => {
    setAdminModalInfo((prev) => ({
      ...prev,
      username,
      role,
      password,
      email,
      id,
    }));
    handleAdminModalShow();
  };

  const deleteAdmin = () => {
    fetch(`${REACT_APP_BACKEND_URL}/delete/admin/${deleteModal.admin_id}`)
      .then((response) =>
        setDeleteModal({ show: false, subdomain: null, subdomain_id: null })
      )
      .catch((err) => console.log(err));
    setRefreshAdmins(!refreshAdmins);
  };

  const handleAdminModalShow = () => {
    setAdminModalInfo((prev) => ({
      ...prev,
      show: !AdminModalInfo.show,
    }));
  };

  const handleAddAdminSuccess = () => {
    setRefreshAdmins(!refreshAdmins);
    handleAdminModalShow();
  };

  return (
    <>
      <AdminModal
        show={AdminModalInfo.show}
        toast={toast}
        onSuccess={handleAddAdminSuccess}
        adminInfo={AdminModalInfo}
        handleShow={handleAdminModalShow}
      />
      <CenteredModal
        show={deleteModal.show}
        onSuccess={deleteAdmin}
        onHide={() =>
          setDeleteModal({ show: false, username: null, admin_id: null })
        }
        header={`Delete Admin?`}
        body={`Are you sure you want to delete admin <strong>${deleteModal.username}</strong>?`}
        successText="Yes, Delete."
      />
      <Stack
        gap={2}
        className="my-3 flex-column flex-sm-row justify-content-between"
        direction="horizontal"
      >
        <Stack
          className="justify-content-between"
          gap={2}
          direction="horizontal"
        >
          <Button
            onClick={openAddAdminModal}
            className="edit-btn"
            size="md"
            variant="p-2 btn-dark"
          >
            Add Admin
          </Button>
          <Button
            className="delete-btn"
            size="md"
            variant="p-2 btn-danger primary"
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
                className="me-2 main-input"
                aria-label="Search"
              />
              <Button variant="dark">
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
              <th>
                <label>
                  {selectedAllDomains ? (
                    <input
                      checked
                      type="checkbox"
                      className="input"
                      onClick={selectAllDomain}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      className="input"
                      onClick={selectAllDomain}
                      checked={false}
                    />
                  )}
                  <span className="custom-checkbox"></span>
                </label>
              </th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colspan="5" className="text-center align-middle">
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
            ) : admins?.length > 0 ? (
              admins.map((item, index) => (
                <tr className="table_row urlsPage">
                  <td>
                    <label>
                      {activeIndex[index] ? (
                        <input
                          checked
                          type="checkbox"
                          className="input"
                          onClick={() => selectDomain(index)}
                        />
                      ) : (
                        <input
                          type="checkbox"
                          className="input"
                          onClick={() => selectDomain(index)}
                          checked={false}
                        />
                      )}
                      <span className="custom-checkbox"></span>
                    </label>
                  </td>
                  <td>
                    <span>{item["username"]}</span>
                  </td>
                  <td>
                    <span>{item["email"]}</span>
                  </td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-top`}>
                          <strong>{item["role"]}</strong>
                        </Tooltip>
                      }
                    >
                      <span>{item["role"]}</span>
                    </OverlayTrigger>
                  </td>
                  <td>
                    <Button
                      className="edit-btn mx-2"
                      variant="p-2 btn-outline-dark"
                      onClick={() =>
                        addAdminInfoToModal(
                          item["_id"],
                          item["role"],
                          item["password"],
                          item["email"],
                          item["username"]
                        )
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() =>
                        setDeleteModal({
                          show: true,
                          username: item["username"],
                          admin_id: item["_id"],
                        })
                      }
                      className="delete-btn"
                      variant="p-2 btn-danger"
                    >
                      Delete
                    </Button>
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
                    <b>No Admin Found</b>
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
