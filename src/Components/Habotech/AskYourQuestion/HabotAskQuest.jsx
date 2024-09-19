import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import "../Habotech.css";
import HabotAppBar from "../HabotAppBar/HabotAppBar";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import {baseURL, createFaqQuestion, faqQuestion} from "../../../helpers/endpoints/api_endpoints";

function HabotAskQuest() {
  const [currentValue, setCurrentValue] = useState([]);
  const [questions, setQuestion] = useState([]);
  const token = localStorage.getItem("accessToken");

  // console.log(baseURL)
  // console.log(createFaqQuestion)

  //*****  ADD QUESTIONS *****//
  const handleAddQuestions = (currentValue) => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };
    const questions = {
      question: currentValue,
    };
  
    axios
      .post(
        `${baseURL}${createFaqQuestion}`,
        questions,
        { headers }
      )
      .then((response) => {
        if (response.data.id) {
          toast.success("Question Submitted Successfully");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  //*****  GET QUESTIONS *****//
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${baseURL}${faqQuestion}`,  {
        headers,
      })
      .then((response) => {
        // console.log("Fetched FAQs:", response.data);
        setQuestion(response.data);
      })
      .catch((error) => {
        console.error("Error fetching FAQs:", error);
      });
  }, [token, currentValue]);

  //*****  pagination *****//

  const handleNext = () => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${questions.next}`, {
        headers,
      })
      .then((res) => {
        // console.log(res.data);
        setQuestion(res.data);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const handlePrev = () => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };
    axios
      .get(`${questions.previous}`, {
        headers,
      })
      .then((res) => {
        // console.log(res.data);
        setQuestion(res.data);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Helmet>
        <title>Customer Journey</title>
        <meta
          name="description"
          content="Customer Journey."
        />
        {/* Add more meta tags as needed */}
      </Helmet>
      <HabotAppBar />
      <div className="mt-5 habotech-container habotech-quest-cont">
        <Container>
          <Row>
            <Col md={6}>
              <br />
              <Form className="Habotech-form">
                <Form.Group controlId="formQuest">
                  <Form.Label>
                    <h5>
                      {" "}
                      <b>Ask your Question</b>
                    </h5>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    as="textarea"
                    rows={4}
                    placeholder="Type your question here"
                    className="haboTech-textarea"
                    onChange={(e) => {
                      const currentValue = e.target.value;
                      setCurrentValue(currentValue);
                    }}
                  />
                </Form.Group>

                <Button
                  onClick={() => handleAddQuestions(currentValue)}
                  className="verified-habotech mt-3"
                >
                  Add Question
                </Button>
              </Form>
            </Col>
            <Col md={6}>
              <div className="mb-2 mt-4">
                <b>Questions asked by me :</b>
              </div>
              {questions?.count > 0 ? (
                questions.results.map((result) => (
                  <div className="techFaq-margin">
                  <div className="faq-question d-flex justify-content-between">
                    <div>
                      <b>{result.question}</b>
                    </div>
                    <div>
                      <i>
                        <sub>
                          <b>~{result.asked_by_info.email}</b>
                        </sub>
                      </i>
                    </div>
                  </div>
                </div>
                
                ))
              ) : (
                <div className="no-result-message">
                  <i>No results found </i>.
                </div>
              )}
              <div className="text-center adminBottomMargin ">
                {questions?.previous === null ? (
                  <button
                    disabled
                    onClick={handlePrev}
                    className="adminAllButtons m-3"
                  >
                    Previous
                  </button>
                ) : (
                  <button onClick={handlePrev} className="adminAllButtons m-3">
                    Previous
                  </button>
                )}
                {questions?.next === null ? (
                  <button
                    disabled
                    onClick={handleNext}
                    className="adminAllButtons m-3"
                  >
                    Next
                  </button>
                ) : (
                  <button onClick={handleNext} className="adminAllButtons m-3">
                    Next
                  </button>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default HabotAskQuest;
