import Layout from "../../components/Layout/Layout";
import "./Interactions.css";

function Interactions() {
  return (
    <Layout>
      <h1>HCP Interaction</h1>

      <form className="interaction-form">

        <input type="text" placeholder="HCP Name" />

        <select>
          <option>Interaction Type</option>
          <option>In Person</option>
          <option>Phone Call</option>
          <option>Video Call</option>
        </select>

        <input type="date" />

        <input type="time" />

        <input type="text" placeholder="Brand Discussed" />

        <textarea
          placeholder="Topics Discussed"
          rows="4"
        ></textarea>

        <button type="submit">
          Save Interaction
        </button>

      </form>
    </Layout>
  );
}

export default Interactions;