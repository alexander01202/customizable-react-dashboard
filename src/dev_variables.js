import not_found from './lottie/not_found.json'
import logo from './assets/logo.png'

export const DARK_MODE_BTN = true
export const REACT_APP_BACKEND_URL = process.env.NODE_ENV === 'development' ? 'https://2252-38-131-68-33.ngrok-free.app' : "https://horizonscanning-api-dev.blackbay-917b2d07.uksouth.azurecontainerapps.io"
export const WEBSOCKET_URL = process.env.NODE_ENV === 'development' ? 'ws://127.0.0.1:8080' : "wss://jon-dykstra-backend-63913e3e1d21.herokuapp.com"
export const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: not_found,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
};

export const OWNER_NAME = "James Nicholls"
export const DEVELOPMENT_PHASE = true
export const SIDE_NAVBAR_PAGES_NAME = ["SEC Alerts"]
export const LOGO_PATH = logo

// MAIN PAGE CUSTOMIZATIONS
export const MAIN_PAGE_DASHBOARD_HEADERS = ["Title", "Source", "Type", "Published"]
export const MAIN_PAGE_FAKE_DATA = [
  {title: "Eurex Clearing Readiness Newsflash | Limitations regarding securities collateral provided via title transfer: Implementation postponed to 1 May 2025", source: 'https://www.eurex.com', type: 'circular', published: '2025-03-21'},
  {title: "Litigation Release - Theodore J. Farnsworth, J. Mitchell Lowe, and Khalid Itum", source: 'https://www.sec.gov', type: 'News', published: '2025-01-02T15:34:15Z'},
  {title: "Remarks to the 2025 Annual Washington Conference of the Institute of International Bankers", source: 'https://www.sec.gov', type: 'Speech', published: '2025-03-10T12:50:59Z'},
  {title: "Office Hours with Gary Gensler: The U.S. Capital Markets and the Securities and Exchange Commission", source: 'https://www.sec.gov', type: 'News', published: '2025-01-16T16:45:16Z'},
]
export const MAIN_PAGE_MODAL_TITLE = "Add new URL"
export const MAIN_PAGE_MODAL_INPUT_OPTIONS = [
  {label: "Article Title", type: 'text', placeholder: "Enter article title", value_reference: "article_title"},
  {label: "CSV File", type: 'file', placeholder: "Upload CSV", value_reference: "csv_file", accept:".csv"},
  {label: "Additional Prompt", type: 'textarea', placeholder: "Enter any additional prompts", value_reference: "additional_prompt", required:false},
]
export const MAIN_PAGE_MODAL_DEFAULT_INFO = {article_title: '', additional_prompt:'', csv_file: '', chart_enabled: false, map_enabled: false}
export const MAIN_PAGE_MODAL_BUTTON_TEXT = "Generate article"


// SECONDARY PAGE CUSTOMIZATIONS
export const SECONDARY_PAGE_DASHBOARD_HEADERS = ["Error", "Date"]
export const SECONDARY_PAGE_FAKE_DATA = [
  {error: "Article Title", date: '2025-10-12'},
  {error: "Article Title", date: '2025-10-12'},
  {error: "Article Title", date: '2025-10-12'},
  {error: "Article Title", date: '2025-10-12'}
]
export const SECONDARY_PAGE_MODAL_TITLE = "Generate new article from URL"

export const SECONDARY_PAGE_MODAL_INPUT_OPTIONS = [
  {label: "Webpage URL", type: 'url', placeholder: "Enter webpage containing images", value_reference: "webpage_url"},
  {label: "Additional Prompt", type: 'textarea', placeholder: "Enter any additional prompts", value_reference: "additional_prompt", required:false},
]
export const SECONDARY_PAGE_MODAL_DEFAULT_INFO = {additional_prompt: '', webpage_url: ''}
export const SECONDARY_PAGE_MODAL_BUTTON_TEXT = "Generate article"

export const IMAGE_EXTRACT_PAGE_DASHBOARD_HEADERS = ["Article Title", "Additional Prompt", "Wordpress Article"]
export const IMAGE_EXTRACT_PAGE_MODAL_TITLE = "Add roundup articles"
export const IMAGE_EXTRACT_PAGE_MODAL_BUTTON_TEXT = "Generate roundup article"
export const IMAGE_EXTRACT_PAGE_MODAL_DEFAULT_INFO = [{ url: "", num_of_images: 1, isAdded: false }]
