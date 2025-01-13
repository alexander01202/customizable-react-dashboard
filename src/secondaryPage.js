import { useEffect, useState, useRef } from "react";
import { Stack, Button, Form, Table, ProgressBar } from "react-bootstrap";
import {
  REACT_APP_BACKEND_URL,
  defaultOptions,
  SECONDARY_PAGE_MODAL_TITLE,
  SECONDARY_PAGE_DASHBOARD_HEADERS,
  DEVELOPMENT_PHASE,
  SECONDARY_PAGE_FAKE_DATA,
  DARK_MODE_BTN,
} from "./dev_variables";
import { useLoaderData, Link, useParams } from "react-router-dom";
import Lottie from "react-lottie";
import "./css/searchEngineUrls.css";
import { Blocks, BallTriangle } from "react-loader-spinner";
import SearchEngineUrlModal from "./components/searchEngineUrlModal";
import { ToastContainer, toast } from "react-toastify";
import CenteredModal from "./components/centeredModal";
import { FaExternalLinkAlt } from "react-icons/fa";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import useWebSocket from "react-use-websocket";
import Pagination from "react-bootstrap/Pagination";

export default function SecondaryPage() {
  const [data, setData] = useState(
    DEVELOPMENT_PHASE ? SECONDARY_PAGE_FAKE_DATA : []
  );
  const [modalInfo, setModalInfo] = useState({
    show: false,
    beginScrape: true,
    urlInfo: {},
  });
  const [refreshUrls, setRefreshUrls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    search_engine_url: null,
    search_engine_url_id: null,
  });
  const { subdomain_id, type } = useParams();
  const wsConnections = useRef({});

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      try {
        await sleep(500);
        setIsLoading(false);
      } catch (error) {
        toast.error(error);
      }
    };
    getData();
  }, []);

  const handleShow = () => {
    setModalInfo((prev) => ({
      ...prev,
      show: !modalInfo.show,
    }));
  };

  const refreshPage = () => {
    setRefreshUrls(!refreshUrls);
  };

  const handleWebSocketMessage = (documentId, message) => {
    const update = JSON.parse(message.data);
    // console.log("WEBSOCKET UPDATE ==> ", update)
  };

  const onUrlSuccess = async (operation, result) => {
    setRefreshUrls(!refreshUrls);
    if (operation === "edit") {
      return;
    }
    // Create a WebSocket connection for the new document
    const scheme = REACT_APP_BACKEND_URL.startsWith("https") ? "wss" : "ws";
    const url = `${scheme}//${REACT_APP_BACKEND_URL.replace(
      "https://",
      ""
    ).replace("http://", "")}/watch/collection/urls/${result}`;
    const ws = new WebSocket(url);
    ws.onmessage = (message) => handleWebSocketMessage(result, message);
    wsConnections.current[result] = ws;
  };

  const deleteSearchEngineUrl = async () => {
    const queryString = new URLSearchParams({
      subdomain_id: subdomain_id,
    }).toString();
    const req = await fetch(
      `${REACT_APP_BACKEND_URL}/search_engine_url/delete/${deleteModal.search_engine_url_id}?${queryString}`
    );
    const { status, result } = await req.json();
    if (status) {
      handleDeleteModal();
      toast.success("URL deleted successfully.");
      setRefreshUrls(!refreshUrls);
    } else {
      toast.error(result);
    }
  };

  const handleDeleteModal = () => {
    setDeleteModal((prev) => ({
      ...prev,
      show: !deleteModal.show,
      search_engine_url: null,
      search_engine_url_id: null,
    }));
  };

  return (
    <>
      {/* <CenteredModal
      show={deleteModal.show}
      onSuccess={deleteSearchEngineUrl}
      onHide={handleDeleteModal}
      header={`Delete Search Engine URL?`}
      body={`Are you sure you want to delete <strong>${deleteModal.search_engine_url}</strong>? <br />.`}
      successText='Yes, Delete.'
    /> */}

      <SearchEngineUrlModal
        onSuccess={onUrlSuccess}
        urlDetails={modalInfo.urlInfo}
        subdomain_type={type}
        subdomain_id={subdomain_id}
        toast={toast}
        handleShow={handleShow}
        show={modalInfo.show}
      />

      {/* <Stack
        gap={2}
        className="my-3 flex-column flex-sm-row"
        direction="horizontal"
      >
        <Stack
          className="justify-content-between"
          gap={2}
          direction="horizontal"
        >
          <Button
            onClick={() =>
              setModalInfo({ show: true, beginScrape: true, urlInfo: {} })
            }
            className="edit-btn"
            size="md"
            variant={`p-2 btn-${DARK_MODE_BTN ? "dark" : "light"}`}
          >
            {SECONDARY_PAGE_MODAL_TITLE}
          </Button>
          <Button
            className="delete-btn"
            size="md"
            variant="p-2 btn-danger primary"
          >
            Delete
          </Button>
        </Stack>
      </Stack> */}

      <Stack
        gap={2}
        className="my-3 flex-column flex-sm-row jusity-content-between"
        direction="horizontal"
      >
        <Stack
          className="justify-content-between"
          gap={1}
          direction="horizontal"
        >
          <Button
            onClick={() =>
              setModalInfo({ show: true, beginScrape: true, urlInfo: {} })
            }
            className="edit-btn"
            size="md"
            variant={`p-0 btn-${DARK_MODE_BTN ? "dark" : "light"}`}
          >
            {SECONDARY_PAGE_MODAL_TITLE}
          </Button>
          <Button
            className="delete-btn"
            size="md"
            variant="p-2 btn-danger primary"
          >
            Delete
          </Button>
        </Stack>
<Stack className="d-none d-md-block">

</Stack>

<Stack className="d-none d-md-block">
  
</Stack>

        <Stack>
          <div className="d-none d-md-block">
            <Form className="ms-auto d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 main-input"
                aria-label="Search"
              />
              <Button variant="dark">Search</Button>
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
              <th>#</th>
              {SECONDARY_PAGE_DASHBOARD_HEADERS.map((header) => (
                <th>{header}</th>
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
            ) : data && data.length > 0 ? (
              data.map((item, index) => (
                <tr className="table_row urlsPage">
                  <td>{index + 1}</td>
                  <td>
                    <Link className="me-2">{item["title"]}</Link>
                  </td>
                  <td>
                    <div className="d-flex align-items-center justify-content-left">
                      <Link className="me-2 ellipsis">{item["url"]}</Link>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${item["url"]}`}
                      >
                        <FaExternalLinkAlt color="blue" pointerEvents={"all"} />
                      </a>
                    </div>
                  </td>
                  <td>
                    <Link className="me-2">{item["additional_prompt"]}</Link>
                  </td>
                  <td className="gap-2">
                    <Button
                      className="edit-btn mx-2"
                      variant="p-2 btn-outline-dark"
                      onClick={() =>
                        setModalInfo({
                          show: true,
                          beginScrape: true,
                          urlInfo: item,
                        })
                      }
                    >
                      EDIT
                    </Button>
                    <Button
                      className="delete-btn mt-2 mt-md-0"
                      variant="p-2 btn-danger"
                      onClick={() =>
                        setDeleteModal({
                          show: true,
                          search_engine_url: item["search_engine_url"],
                          search_engine_url_id: item["_id"],
                        })
                      }
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={"6"}>
                  <h1 className="my-2 empty-records">
                    <b>No Image Articles Found</b>
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

export async function Loader({ params }) {
  const subdomain_id = params.subdomain_id;
  const req = await fetch(
    `${REACT_APP_BACKEND_URL}/subdomain/${subdomain_id}/searchEngineUrls`
  );
  let { status, result } = await req.json();

  if (status) {
    result = [...result];
  } else {
    result = [];
  }

  return result;
}
