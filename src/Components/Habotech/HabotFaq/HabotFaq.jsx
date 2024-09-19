import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../Habotech.css";
import axios from "axios";
import { toast } from "react-toastify";
import {
  baseURL,
  createFaqQuestion,
  faqQuestion,
} from "../../../helpers/endpoints/api_endpoints";

function Habotech() {
  const [quest, setQuest] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [faqList, setFaqList] = useState([]);
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [openAccordions, setOpenAccordions] = useState([]);
  const [getAnswersData, setGetAnswersData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recentQuestion, setRecentQuestion] = useState([]);
  const [questions, setQuestion] = useState([]);

  // console.log(recentQuestion);
  const onSubmit = (data) => {
    const accessToken = localStorage.getItem("accessToken");

    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .post(`${baseURL}${createFaqQuestion}`, data, { headers })
      .then((response) => {
        // console.log("Response:", response.data);
        setRecentQuestion((prevRecentQuestions) => [
          ...prevRecentQuestions,
          response.data,
        ]);
        toast.success("Question Submitted Successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const addQuest = () => {
    if (quest.trim() !== "") {
      const newQuestion = { question: quest, answers: [] };

      onSubmit(newQuestion);

      // Update local state
      setFaqList([...faqList]);

      setQuest("");
    }
  };

  const toggleAccordion = (index) => {
    const isOpen = openAccordions.includes(index);

    if (isOpen) {
      setOpenAccordions(openAccordions.filter((i) => i !== index));
    } else {
      setOpenAccordions([...openAccordions, index]);
    }
  };

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    // console.log(accessToken);
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${baseURL}${faqQuestion}`, {
        headers,
      })
      .then((response) => {
        // console.log("Fetched FAQs:", response.data);
        setQuestion(response.data);
        // Check if response.data.results is an array before setting faqList
        if (Array.isArray(response.data.results)) {
          setFaqList(response.data.results);
          if (response.data.results.length > 0) {
            const mostRecent =
              response.data.results[response.data.results.length - 1];
          }
        } else {
          console.error(
            "Invalid data format. Expected an array in response.data.results."
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching FAQs:", error);
      });
  }, [accessToken, recentQuestion.length]);

  // console.log(faqList);

  const addAnswer = async (index) => {
    // console.log(index);
    const accessToken = localStorage.getItem("accessToken");

    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    const answerData = {
      answer: currentAnswers,
    };

    try {
      const response = await axios.post(
        `https://habottech-dashboard.uc.r.appspot.com/faqs/create-faq-answer/${index}/`,
        answerData,
        { headers }
      );

      // console.log("Answer Submitted Successfully:", response.data);
      const updatedFaqList = [...faqList];
      updatedFaqList[index]?.answers?.push(response.data.answer);
      setFaqList(updatedFaqList);
      toast.success("Answer Submitted Successfully");
      setCurrentAnswers("");
      document.getElementById("answerInput").value = "";
      document.getElementById("answerInput2").value = "";

      // Now that the answer is submitted, fetch the updated answer data
      getAnswerData(index);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  // get answer

  const getAnswerData = useCallback(
    (id) => {
      // console.log(id);
      const accessToken = localStorage.getItem("accessToken");

      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      axios
        .get(
          `https://habottech-dashboard.uc.r.appspot.com/faqs/faq-answers/${id}/`,
          { headers }
        )
        .then((response) => {
          // console.log("Answers :", response.data);
          setGetAnswersData((prevData) => ({
            ...prevData,
            [id]: response.data,
          }));
        })
        .catch((error) => {
          console.error("Error submitting answer:", error);
        });
    },
    [setGetAnswersData]
  );

  useEffect(() => {
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    // Fetch data for the first page
    const fetchData = async (url) => {
      try {
        const response = await axios.get(url, { headers });
        const data = response.data;

        if (Array.isArray(data.results)) {
          // Update faqList with unique results
          setRecentQuestion((prevFaqList) => {
            const newResults = data.results.filter(
              (newQuestion) =>
                !prevFaqList.some(
                  (existingQuestion) => existingQuestion.id === newQuestion.id
                )
            );

            return [...prevFaqList, ...newResults];
          });
        }

        // Update the total pages

        // If there's a next page, fetch it
        if (data.next) {
          fetchData(data.next);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchData(
      `https://habottech-dashboard.uc.r.appspot.com/faqs/faq-questions/?page=${currentPage}`
    );
  }, [accessToken, currentPage]);

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
        setFaqList(res.data.results);
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
        setFaqList(res.data.results);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  // search
  const filteredQuestions = Array.isArray(recentQuestion)
    ? searchQuery.trim() !== ""
      ? recentQuestion.filter((question) =>
          question.question.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : []
    : [];

  // console.log(filteredQuestions);

  const uniqueQuestionIds = new Set();
  const uniqueQuestions = filteredQuestions.filter((question) => {
    if (uniqueQuestionIds.has(question.id)) {
      return false;
    } else {
      uniqueQuestionIds.add(question.id);
      return true;
    }
  });

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

      <div className=" habotech-container">
        <Container className="top_faq_margin">
          <Row>
            <Col>
              <Form.Control
                type="text"
                placeholder="Search FAQ"
                // value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="haboTech-search mb-4"
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Label>
                <h5>
                  <b>FAQ</b>
                </h5>
                <s>
                  {" "}
                  <i>No. of Questions : {questions?.count} </i>
                </s>
              </Form.Label>
              <br />

              {uniqueQuestions.length === 0 ? (
                faqList.length === 0 ? (
                  <i>No queries have been raised so far.</i>
                ) : (
                  <div>
                    {faqList.map((faq, index) => (
                      <div key={index} className="techFaq-margin">
                        <div
                          className="faq-question"
                          onClick={() => {
                            toggleAccordion(index);
                            getAnswerData(faq.id);
                          }}
                        >
                          <b>{faq.question} </b>
                          <sub>
                            <i> ~{faq.asked_by_info.email}</i>
                          </sub>
                          <b className="techFaqPlus">+</b>
                        </div>
                        {openAccordions.includes(index) && (
                          <div>
                            {getAnswersData[faq.id]?.count === 0 ? (
                              <div className="not-answered-message">
                                Awaiting response!
                              </div>
                            ) : (
                              getAnswersData[faq.id]?.results?.map(
                                (answer, answerIndex) => (
                                  <div
                                    key={answerIndex}
                                    className="d-flex justify-content-between faq-ans"
                                  >
                                    <b>-{answer.answer}</b>
                                    <i>
                                      {" "}
                                      <sub>
                                        ~{answer.answered_by_info.email}
                                      </sub>
                                    </i>
                                  </div>
                                )
                              )
                            )}

                            <Form.Group
                              controlId={`formAnswer-${index}`}
                              className="mt-2"
                            >
                              <Form.Control
                                id="answerInput"
                                className="haboTech-text"
                                type="text"
                                placeholder="Add the answer"
                                onChange={(e) => {
                                  const updatedCurrentAnswers = e.target.value;
                                  setCurrentAnswers(updatedCurrentAnswers);
                                  // console.log(updatedCurrentAnswers);
                                }}
                              />

                              <Button
                                className="verified-habotech mt-2"
                                onClick={() => addAnswer(faq.id)}
                              >
                                Add Answer
                              </Button>
                            </Form.Group>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div>
                  {uniqueQuestions.map((faq, index) => (
                    <div key={index} className="techFaq-margin">
                      <div
                        className="faq-question"
                        onClick={() => {
                          toggleAccordion(index);
                          getAnswerData(faq.id);
                        }}
                      >
                        <b>{faq.question}</b>
                        <b className="techFaqPlus">+</b>
                      </div>
                      {openAccordions.includes(index) && (
                        <div>
                          {getAnswersData[faq.id]?.count === 0 ? (
                            <div className="not-answered-message">
                              Awaiting response!
                            </div>
                          ) : (
                            getAnswersData[faq.id]?.results?.map(
                              (answer, answerIndex) => (
                                <div
                                  key={answerIndex}
                                  className="d-flex justify-content-between faq-ans"
                                >
                                  <b>-{answer.answer}</b>
                                  <i>
                                    {" "}
                                    <sub>~{answer.answered_by_info.email}</sub>
                                  </i>
                                </div>
                              )
                            )
                          )}

                          <Form.Group
                            controlId={`formAnswer-${index}`}
                            className="mt-2"
                          >
                            <Form.Control
                              id="answerInput"
                              className="haboTech-text"
                              type="text"
                              placeholder="Add the answer"
                              onChange={(e) => {
                                const updatedCurrentAnswers = e.target.value;
                                setCurrentAnswers(updatedCurrentAnswers);
                                // console.log(updatedCurrentAnswers);
                              }}
                            />

                            <Button
                              className="verified-habotech mt-2"
                              onClick={() => addAnswer(faq.id)}
                            >
                              Add Answer
                            </Button>
                          </Form.Group>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {searchQuery !== "" &&
                faqList.length === 0 &&
                faqList.length > 0 && (
                  <div className="no-result-message">
                    <i>No results found for </i>"{searchQuery}".
                  </div>
                )}

              <button
                onClick={handlePrev}
                disabled={questions.previous === null}
                className="adminAllButtons m-3"
              >
                {questions.previous === null ? "Disabled" : "Previous"}
              </button>
              <button
                disabled={questions.next === null}
                onClick={handleNext}
                className="adminAllButtons m-3"
              >
                {questions.next === null ? "Disabled" : "Next"}
              </button>
            </Col>
            <Col md={6}>
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
                    value={quest}
                    onChange={(e) => setQuest(e.target.value)}
                    className="haboTech-textarea"
                  />
                </Form.Group>

                <Button className="verified-habotech mt-3" onClick={addQuest}>
                  Add Question
                </Button>

                <div>
                  <strong>Most recent question</strong> <br />
                  {faqList.length === 0 ? (
                    <i>No queries have been raised so far.</i>
                  ) : (
                    <div>
                      {faqList[0] && (
                        <div className="techFaq-margin">
                          <div
                            className="faq-question"
                            onClick={() => {
                              toggleAccordion(0); // Assuming you want to toggle the accordion for the FAQ at index 0
                              getAnswerData(faqList[0].id);
                            }}
                          >
                            <b>{faqList[0].question} </b>
                            <sub>
                              <i> ~{faqList[0].asked_by_info.email}</i>
                            </sub>
                            <b className="techFaqPlus">+</b>
                          </div>
                          {openAccordions.includes(0) && (
                            <div>
                              {getAnswersData[faqList[0].id]?.count === 0 ? (
                                <div className="not-answered-message">
                                  Awaiting response!
                                </div>
                              ) : (
                                getAnswersData[faqList[0].id]?.results?.map(
                                  (answer, answerIndex) => (
                                    <div
                                      key={answerIndex}
                                      className="d-flex justify-content-between faq-ans"
                                    >
                                      <b>-{answer.answer}</b>
                                      <i>
                                        {" "}
                                        <sub>
                                          ~{answer.answered_by_info.email}
                                        </sub>
                                      </i>
                                    </div>
                                  )
                                )
                              )}

                              <Form.Group
                                controlId={`formAnswer-0`}
                                className="mt-2"
                              >
                                <Form.Control
                                  id="answerInput2"
                                  className="haboTech-text"
                                  type="text"
                                  placeholder="Add the answer"
                                  onChange={(e) => {
                                    const updatedCurrentAnswers =
                                      e.target.value;
                                    setCurrentAnswers(updatedCurrentAnswers);
                                    // console.log(updatedCurrentAnswers);
                                  }}
                                />

                                <Button
                                  className="verified-habotech mt-2"
                                  onClick={() => addAnswer(faqList[0].id)}
                                >
                                  Add Answer
                                </Button>
                              </Form.Group>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Habotech;
