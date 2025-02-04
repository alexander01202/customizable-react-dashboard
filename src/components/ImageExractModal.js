import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { REACT_APP_BACKEND_URL, IMAGE_EXTRACT_PAGE_MODAL_DEFAULT_INFO } from '../dev_variables';

export default function ImageExtractModal({ show, handleShow, toast, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [additionalPrompt, setAdditonalPrompt] = useState("")
  const [articleTitle, setArticleTitle] = useState("")
  const [inputs, setInputs] = useState(IMAGE_EXTRACT_PAGE_MODAL_DEFAULT_INFO);

  const updateInputValue = (index, field, value) => {
    setInputs((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const updateAdditionalPrompt = (e) => {
    setAdditonalPrompt(e.target.value)
  }

  const updateArticleTitle = (e) => {
    setArticleTitle(e.target.value)
  }

  const toggleEditMode = (index) => {
    setInputs((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isAdded: !item.isAdded } : item
      )
    );
  };

  const addInputField = () => {
    setInputs([...inputs, { url: "", num_of_images: 1, images: [], isAdded: false }]);
  };

  const removeInputField = (index) => {
    setInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const addRoundUpArticle = async () => {
    console.log("adding data...")
    setIsLoading(true)
    let headers = new Headers();

    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    var url = REACT_APP_BACKEND_URL + '/add/article/roundup'

    try {
      const req = await fetch(url, {
        method:'POST',
        body: JSON.stringify({
          "roundup_article_data": inputs,
          "additional_prompt": additionalPrompt,
          "article_title": articleTitle
        }),
        headers
      })
      const {status, data} = await req.json()
      if (status) {
        onSuccess()
        if (show) {
          toast.success(`Roundup Article successfully added`)
        }
        handleModalClose()
        return
      }
      throw new Error(data);
    } catch (err) {
      setIsLoading(false)
      toast.error(err)
    }
  }

  const handleModalClose = () => {
    setInputs(IMAGE_EXTRACT_PAGE_MODAL_DEFAULT_INFO);
    setArticleTitle("")
    setIsLoading(false)
    handleShow();
  };

  return (
    <Modal show={show} onHide={handleModalClose}>
      <Modal.Header closeButton={true}>
        <Modal.Title>Image Extract From URL</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Article Title</Form.Label>
            <Form.Control
              type="input"
              placeholder="Enter article title"
              value={articleTitle}
              onChange={updateArticleTitle}
            />
          </Form.Group>
          {inputs.map((input, index) => (
            <div key={index} className="mb-3 border p-3 rounded position-relative">
              {!input.isAdded ? (
                <>
                  <Form.Group className="mb-2">
                    <Form.Label>URL</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="Enter URL"
                      value={input.url}
                      onChange={(e) =>
                        updateInputValue(index, "url", e.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Number of Images</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={input.num_of_images}
                      onChange={(e) =>
                        updateInputValue(index, "num_of_images", e.target.value)
                      }
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="danger"
                      onClick={() => removeInputField(index)}
                      disabled={inputs.length === 1}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => toggleEditMode(index)}
                      disabled={!input.url || input.num_of_images < 1}
                    >
                      Add
                    </Button>
                  </div>
                </>
              ) : (
                <div>
                  <div>
                    <strong>URL:</strong> {input.url}
                  </div>
                  <div>
                    <strong>Number of Images:</strong> {input.num_of_images}
                  </div>
                  <Button
                    variant="link"
                    className="position-absolute top-0 end-0 text-primary"
                    onClick={() => toggleEditMode(index)}
                  >
                    <FaEdit />
                  </Button>
                </div>
              )}
            </div>
          ))}
          <Button className="mb-3" onClick={addInputField} variant="primary">
            Add More URL
          </Button>
          <Form.Group className="mb-2">
            <Form.Label>Additional Prompt</Form.Label>
            <Form.Control
              type="textarea"
              as="textarea"
              placeholder="Enter any additional prompt you have..."
              value={additionalPrompt}
              onChange={updateAdditionalPrompt}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
        <Button onClick={addRoundUpArticle} variant="success" disabled={isLoading}>
          {"Generate Roundup Article"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
