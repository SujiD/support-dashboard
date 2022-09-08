import { DataBox } from "../components/Data-Box/DataBox";
import { NavBar } from "../components/nav-bar/NavBar";
import { useState } from "react";
import { ownerData, colors } from "../Database/Data";
import PieChart from "../components/PieChart";
import DataView from "../components/DataView";
import { Form } from "react-bootstrap";
import { pData, sData, dData, plen, slen, dlen } from "../common/filter";
import Calendar from "../components/calendar/Calendar";
import BarChart from "../components/BarChart";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import StaticBox from "../components/static-box/StaticBox";

export const HomePage = () => {
  const [selectStat, setSelectStat] = useState("owner");
  const [productData, setProductData] = useState({
    labels: dData.map((data) => data.name),
    datasets: [
      {
        label: "Department",
        data: dData.map((data) => data.count),
        backgroundColor: colors.map((color) => color),
        borderColor: colors.map((color) => color),
        borderWidth: 1,
      },
    ],
  });

  const [priorityD, setPriorityD] = useState({
    labels: pData.map((d) => d.name),
    datasets: [
      {
        label: "Priority",
        data: pData.map((data) => data.count),
        backgroundColor: colors.map((color) => color),
        borderColor: colors.map((color) => color),
        borderWidth: 1,
      },
    ],
  });

  const [statusD, setStatusD] = useState({
    labels: sData.map((d) => d.name),
    datasets: [
      {
        label: "Status",
        data: sData.map((data) => data.count),
        backgroundColor: colors.map((color) => color),
        borderColor: colors.map((color) => color),
        borderWidth: 1,
      },
    ],
  });

  const [ownerD, setOwnerD] = useState({
    labels: ownerData.map((d) => d.name),
    datasets: [
      {
        label: "Owner",
        data: ownerData.map((data) => data.count),
        backgroundColor: colors.map((color) => color),
        borderColor: colors.map((color) => color),
        borderWidth: 1,
      },
    ],
  });

  const handleChange = (event) => {
    setSelectStat(event.target.value);
  };
  return (
    <>
      <NavBar />
      <div className="date-cont">
        <Calendar />
      </div>
      <div className="d-flex align-items-c.enter justify-content-evenly mb-5 top-home">
        <button
          className="data-box-btn mt-5"
          style={{ borderColor: "#70d8c1" }}
          onClick={() => setSelectStat("Owner")}
        >
          <BarChart chartData={ownerD} className="bar-chart" />
        </button>

        <button
          className="data-box-btn mt-5 align-center"
          style={{ borderColor: "#f5d881" }}
          onClick={() => setSelectStat("Product")}
        >
          <BarChart chartData={productData} className="bar-chart" />
        </button>

        <button
          className="data-box-btn mt-5"
          style={{ borderColor: "#ffbd8e" }}
          onClick={() => setSelectStat("Status")}
        >
          <BarChart chartData={statusD} className="bar-chart" />
        </button>

        <button
          className="data-box-btn mt-5"
          style={{ borderColor: "#ff984e" }}
          onClick={() => setSelectStat("Priority")}
        >
          <BarChart chartData={priorityD} className="bar-chart" />
        </button>
      </div>
      <div className="d-flex">
        <StaticBox
          heading={"What's new with entities"}
          content={
            <div className=" d-flex align-items-center chart-container">
              <Form.Select
                size="sm"
                onChange={(event) => handleChange(event)}
                value={selectStat}
                className="select-home"
              >
                <option value="Owner">Owner</option>
                <option value="Product">Product</option>
                <option value="Status">Status</option>
                <option value="Priority">Priority</option>
              </Form.Select>
              {selectStat === "Priority" ? (
                <PieChart chartData={priorityD} className="pie-chart" />
              ) : selectStat === "Status" ? (
                <PieChart chartData={statusD} className="pie-chart" />
              ) : selectStat === "Product" ? (
                <PieChart chartData={productData} className="pie-chart" />
              ) : (
                <PieChart chartData={ownerD} className="pie-chart" />
              )}
            </div>
          }
        />
        <StaticBox
          heading={"Entity Table"}
          content={
            selectStat === "Priority" ? (
              <DataView viewData={pData} table={selectStat} />
            ) : selectStat === "Status" ? (
              <DataView viewData={sData} table={selectStat} />
            ) : selectStat === "Product" ? (
              <DataView viewData={dData} table={selectStat} />
            ) : (
              <DataView viewData={ownerData} table={selectStat} />
            )
          }
        />
      </div>
    </>
  );
};
