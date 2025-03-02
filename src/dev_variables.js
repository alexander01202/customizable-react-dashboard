import not_found from './lottie/not_found.json'
import logo from './assets/logo.webp'

export const DARK_MODE_BTN = true
export const REACT_APP_BACKEND_URL = process.env.NODE_ENV === 'development' ? 'https://jon-dykstra-backend-63913e3e1d21.herokuapp.com' : "https://jon-dykstra-backend-63913e3e1d21.herokuapp.com"
export const WEBSOCKET_URL = process.env.NODE_ENV === 'development' ? 'ws://127.0.0.1:8080' : "wss://jon-dykstra-backend-63913e3e1d21.herokuapp.com"
export const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: not_found,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
};

export const OWNER_NAME = "Jon Dysktra"
export const DEVELOPMENT_PHASE = true
export const SIDE_NAVBAR_PAGES_NAME = ["CSV Articles", "Image Articles"]
export const LOGO_PATH = logo

// MAIN PAGE CUSTOMIZATIONS
export const MAIN_PAGE_DASHBOARD_HEADERS = ["Article Title", "Csv URL", "Wordpress Article", "Additional Prompt"]
export const MAIN_PAGE_FAKE_DATA = [
  {title: "Article Title", additional_prompt: '', chart_enabled: true, map_enabled: false},
  {title: "Article Title", additional_prompt: '', chart_enabled: false, map_enabled: false},
  {title: "Article Title", additional_prompt: '', chart_enabled: false, map_enabled: true},
  {title: "Article Title", additional_prompt: '', chart_enabled: true, map_enabled: true}
]
export const MAIN_PAGE_MODAL_TITLE = "Generate new article based on CSV"
export const MAIN_PAGE_MODAL_INPUT_OPTIONS = [
  {label: "Article Title", type: 'text', placeholder: "Enter article title", value_reference: "article_title"},
  {label: "CSV File", type: 'file', placeholder: "Upload CSV", value_reference: "csv_file", accept:".csv"},
  // {label: "Enable Price Chart", type: 'switch', value_reference: "chart_enabled"},
  // {label: "Enable Maps", type: 'switch', value_reference: "map_enabled"},
  {label: "Additional Prompt", type: 'textarea', placeholder: "Enter any additional prompts", value_reference: "additional_prompt", required:false},
]
export const MAIN_PAGE_MODAL_DEFAULT_INFO = {article_title: '', additional_prompt:'', csv_file: '', chart_enabled: false, map_enabled: false}
export const MAIN_PAGE_MODAL_BUTTON_TEXT = "Generate article"


// SECONDARY PAGE CUSTOMIZATIONS
export const SECONDARY_PAGE_DASHBOARD_HEADERS = ["Article Title", "Scrapped Website", "Wordpress Article", "Additional Prompt", '']
export const SECONDARY_PAGE_FAKE_DATA = [
  {title: "Article Title", url: "https://react-bootstrap.netlify.app/docs/forms/checks-radios/#reverse", additional_prompt: ''},
  {title: "Article Title", url: "https://react-bootstrap.netlify.app/docs/forms/checks-radios/#reverse", additional_prompt: ''},
  {title: "Article Title", url: "https://react-bootstrap.netlify.app/docs/forms/checks-radios/#reverse", additional_prompt: 'false'},
  {title: "Article Title", url: "https://react-bootstrap.netlify.app/docs/forms/checks-radios/#reverse", additional_prompt: 'true'}
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
