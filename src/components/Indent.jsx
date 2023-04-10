import React, { useState, useEffect } from "react";
import IndentDataService from "../services/IndentService";

const Indent = props => {
  const initialIndentState = {
    indent_id: "",
    code:"",
    customerId: "",
    indentStatus: ""
  };
  const [currentIndent, setCurrentIndent] = useState(initialIndentState);
  const [message, setMessage] = useState("");

  const getIndent = id => {
    IndentDataService.get(id)
      .then(response => {
        setCurrentIndent(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getIndent(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentIndent({ ...currentIndent, [name]: value });
  };

  const updatePublished = status => {
    var data = {
      indent_id: currentIndent.indent_id,
      code: currentIndent.code,
      customerId: currentIndent.customerId,
      indentStatus: currentIndent.indentStatus
    };

    IndentDataService.update(currentIndent.id, data)
      .then(response => {
        setCurrentIndent({ ...currentIndent});
        console.log(response.data);
        setMessage("The status was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const updateIndent = () => {
    IndentDataService.update(currentIndent.id, currentIndent)
      .then(response => {
        console.log(response.data);
        setMessage("The indent was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteIndent = () => {
    IndentDataService.remove(currentIndent.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/indents");
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
        <h1>IndentCOMPONENT</h1>
    </div>
   /*  <div>
      {currentIndent ? (
        <div className="edit-form">
          <h4>Indent</h4>
          <form>
            <div className="form-group">
              <label htmlFor="indentName">Name</label>
              <input
                type="text"
                className="form-control"
                id="indentName"
                name="indentName"
                value={currentIndent.indentName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="discount">Description</label>
              <input
                type="text"
                className="form-control"
                id="discount"
                name="discount"
                value={currentIndent.discount}
                onChange={handleInputChange}
              />
            </div>
          </form>

          <button className="badge badge-danger mr-2" onClick={deleteIndent}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateIndent}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Indent...</p>
        </div>
      )}
    </div> */
  );
};

export default Indent;