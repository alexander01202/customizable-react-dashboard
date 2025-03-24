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




const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const selectStyle = { ...inputStyle };

// Dropdown options
const regulatorOptions = [
  { value: '', label: 'All Regulators' },
  { value: 'sebi', label: 'Securities and Exchange Board of India' },
  { value: 'nse', label: 'NSE' },
  { value: 'china_sec', label: 'China Securities Regulatory Commission' },
  { value: 'eurex', label: 'EUREX Exchange' },
  { value: 'esma', label: 'European Securities and Markets Authority' },
  { value: 'fca', label: 'Financial Conduct Authority' },
  { value: 'cboe', label: 'Cboe Global Markets, Inc.' },
  { value: 'finra', label: 'Financial Industry Regulatory Authority' },
  { value: 'cftc', label: 'Commodity Futures Trading Commission' },
  { value: 'sec', label: 'Securities and Exchange Commission' },
];

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'press_releases', label: 'Press Releases' },
  { value: 'speeches_statements', label: 'Speeches And Statements' },
  { value: 'meetings_events', label: 'Meetings & Events' },
  { value: 'past_meetings_events', label: 'Past Meetings & Events' },
  { value: 'sec_videos', label: 'Sec Videos' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'whats_new', label: "What's New" },
  { value: 'policy_statements', label: 'Policy Statements' },
  { value: 'data_research', label: 'Data & Research' },
  { value: 'risk_alerts', label: 'Risk Alerts' },
  { value: 'rulemaking_activity', label: 'Rulemaking Activity' },
  { value: 'staff_accounting_bulletins', label: 'Staff Accounting Bulletins' },
  { value: 'staff_legal_bulletins', label: 'Staff Legal Bulletins' },
  { value: 'investment_mgmt_faq', label: 'Division Of Investment Management: Frequently Asked Questions' },
  { value: 'exchange_act_notices_orders', label: 'Exchange Act Exemptive Notices And Orders' },
  { value: 'investment_company_deregistration', label: 'Investment Company Act Deregistration Notices And Orders' },
  { value: 'investment_company_notices_orders', label: 'Investment Companies Act Notices And Orders' },
  { value: 'other_commission_orders', label: 'Other Commission Orders Notices And Information' },
  { value: 'petitions_rulemaking', label: 'Petitions For Rulemaking' },
];

const tableHeadings = ['Title', 'Source', 'Type', 'Published', 'Action'];

const TableData = Array(14).fill({
  title: 'title',
  source: 'source https://www.sec.gov/',
  type: 'news',
  published: '23-3-2025',
}).map((item, idx) => ({
  ...item,
  type: idx % 2 === 0 ? 'news' : 'press release',
}));

const itemsPerPage = 10;



function App() {

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(TableData.length / itemsPerPage);
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = TableData.slice(indexOfFirstItem, indexOfLastItem);
  

    const pagesAroundCurrent = Array.from(
      { length: Math.min(3, totalPages) },
      (_, i) => i + Math.max(currentPage - 1, 1)
    );


    const onPageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };  
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
         RegPass© Horizon Scanning
        </Stack>
        <Stack className="d-none d-md-block"></Stack>

        <Stack className="d-none d-md-block"></Stack>

        <Stack className="d-flex flex-row justify-content-between">
  <div className="d-none d-md-block w-100">
    <div className="d-flex align-items-center gap-4">
      <select name="regulators" style={selectStyle}>
        {regulatorOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select name="types" style={selectStyle}>
        {typeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <Button variant={`${DARK_MODE_BTN ? "dark" : "light"}`}>Filter</Button>
    </div>
  </div>

  <div className="d-block d-md-none w-100">
  <div className="d-flex flex-column gap-2">
      <select name="regulators" style={selectStyle}>
        {regulatorOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select name="types" style={selectStyle}>
        {typeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

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
          currentItems?.map((item, index) => (
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
                  <td>
                      <div className="flex gap-6 items-center">
                                            <MdModeEdit className="text-xl cursor-pointer" />
                                            <MdDelete className="text-xl cursor-pointer" />
                                          </div>
                  </td>
                </tr>
              ))
         }



         {/* ----------------------pagination------------- */}


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
