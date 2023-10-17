import React, { useEffect, useState } from "react";
import axios from "../../util/axios";
import LoadingSkeleton from "../../components/UI/LoadingSkeleton/LoadingSkeleton";
import { Helmet } from "react-helmet-async";
import "./HelpPage.css";

const HelpPage = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [help, setHelp] = useState({});
  const [errorText, setErrorText] = useState("");

  const { id } = match.params;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/read/this-help/${id}`)
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setHelp(response.data.thisHelp);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          setErrorText(err.response.data.message);
        }
      });
  }, [id]);

  return (
    <section id="help_page">
      <Helmet>
        <title>{`راهنمای ${help?.title}`}</title>
      </Helmet>
      {loading ? (
        <>
          <LoadingSkeleton />
          <LoadingSkeleton />
        </>
      ) : errorText.length > 0 ? (
        <p className="warning-message">{errorText}</p>
      ) : (help?._id?.length > 0 && (
          <React.Fragment>
            <h4 className="helpTitle">{help.title}</h4>
            <p className="help_description">{help.description}</p>
            {help.photos && help.photos.length > 0 && (
              <div className="help_imgs_wrapper">
                {help.photos.map((photo, i) => (
                  <React.Fragment>
                    <span className="my-2 font-sm">{`مرحله ${i + 1} :`}</span>
                    <img
                      key={i*3}
                      src={`${process.env.REACT_APP_GONSHAP_IMAGES_URL}/${photo}`}
                      alt={help.title}
                      className="mb-3"
                    />
                  </React.Fragment>
                ))}
              </div>
            )}
          </React.Fragment>
        )
      )}
    </section>
  );
};

export default HelpPage;
