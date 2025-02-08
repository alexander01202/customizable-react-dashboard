import { useEffect, useState, useRef } from "react";
import { Stack, Button, Form, Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import ImagesExtractModal from "./components/ImageExractModal";
import { BallTriangle } from "react-loader-spinner";
import { FaExternalLinkAlt } from "react-icons/fa";
import "./css/searchEngineUrls.css";
import {
  DARK_MODE_BTN,
  IMAGE_EXTRACT_PAGE_DASHBOARD_HEADERS,
  IMAGE_EXTRACT_PAGE_MODAL_TITLE,
  defaultOptions,
  REACT_APP_BACKEND_URL
} from "./dev_variables";
import Lottie from "react-lottie";
import { Link } from "react-router-dom";

export default function RoundupArticles() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false)
  const [data, setData] = useState([])
  const [modalInfo, setModalInfo] = useState({
    show: false,
  });

  useEffect(() => {
    const getRoundupArticles = async() => {
      const req = await fetch(REACT_APP_BACKEND_URL + "/roundupArticles")
      const {status, data} = await req.json()

      if (status) {
        setData(data)
      }
      setIsLoading(false)
    }
    getRoundupArticles()
  }, [refreshData]);

  const handleShow = () => {
    setModalInfo((prev) => ({
      ...prev,
      show: !modalInfo.show,
    }));
  };

  const onUrlSuccess = () => {
    setRefreshData(!refreshData)
  };


  return (
    <>
      <ImagesExtractModal
        onSuccess={onUrlSuccess}
        toast={toast}
        handleShow={handleShow}
        show={modalInfo.show}
      />

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
            {IMAGE_EXTRACT_PAGE_MODAL_TITLE}
          </Button>
        </Stack>
        <Stack className="d-none d-md-block"></Stack>

        <Stack className="d-none d-md-block"></Stack>

        <Stack>
          <div className="d-none d-md-block">
            <Form className="ms-auto d-flex gap-3">
              <Form.Control
                type="search"
                placeholder="Search"
                className=""
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
                className="me-2 main-input "
                aria-label="Search"
                style={{ flex: "1" }}
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
              {IMAGE_EXTRACT_PAGE_DASHBOARD_HEADERS.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3" className="text-center align-middle">
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
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <Link className="me-2">{item["title"]}</Link>
                  </td>
                  <td>
                    <Link className="me-2">{item["additional_prompt"] ? item["additional_prompt"] : "None"}</Link>
                  </td>
                  <td>
                    <div className="d-flex align-items-center justify-content-left">
                      <Link className="me-2 ellipsis">{item["wordpress_article_url"]}</Link>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${item["wordpress_article_url"]}`}
                      >
                        <FaExternalLinkAlt color="blue" pointerEvents={"all"} />
                      </a>
                    </div>
                  </td>
                  <td>
                    <Link
                      className="ellipsis"
                      to={item.url}
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      {item.wordpress_article_url}
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={"6"}>
                  <h1 className="my-2 empty-records">
                    <b>No Round Up Articles Found</b>
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
