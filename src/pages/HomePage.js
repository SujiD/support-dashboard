import { DataBox } from "../components/Data-Box/DataBox";
import { NavBar } from "../components/nav-bar/NavBar";
import { useState } from "react";
import { DepartmentData, ownerData, colors, priorityData, statusData } from "../Database/Data";
import PieChart from "../components/PieChart";
import DataView from "../components/DataView";
import { Form } from "react-bootstrap";
import { pData, sData, dData, plen, slen, dlen } from "../common/filter";

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
    ]
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
    ]
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
    ]
  });

  const [ownerD, setOwnerD] = useState({
    labels: ownerData.map((d) => d.owner),
    datasets: [
      {
        label: "Owner",
        data: ownerData.map((data) => data.count),
        backgroundColor: colors.map((color) => color),
        borderColor: colors.map((color) => color),
        borderWidth: 1,
      },
    ]
  });

  var today = new Date();
  const [day, setDay] = useState(String(today.getDate()).padStart(2, '0'));
  const [month, setMonth] = useState(String(today.getMonth() + 1));


  var yy = String(today.getFullYear())

  const handleDate = (event) => {
    setDay(String((event.target.value).split("-")[2]));
    setMonth(String((event.target.value).split("-")[1][1]));
  }


  const monthNames = ["", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const handleChange = (event) => {
    setSelectStat(event.target.value)
  }
  return (
    <>
      <NavBar />
      <div className="date-cont">
        <input type="date" onChange={(e) => handleDate(e)} value={yy + "-" + month.padStart(2, '0') + "-" + day}/>
        <div className="cal m-3">
          <div className="month">{monthNames[month]}</div>
          <div className="date">{day}</div>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-evenly mb-5">
        <button className="data-box-btn mt-5" style={{ borderColor: "#70d8c1" }} onClick={() => setSelectStat("Owner")}>
          <DataBox heading={"567,879"} text={"Ticket counts by owner"} />
        </button>
        <button className="data-box-btn mt-5" style={{ borderColor: "#f5d881" }} onClick={() => setSelectStat("Product")}>
          <DataBox heading={String(dlen)} text={"Ticket counts by product"} />
        </button>
        <button className="data-box-btn mt-5" style={{ borderColor: "#ffbd8e" }} onClick={() => setSelectStat("Status")}>
          <DataBox heading={String(slen)} text={"Ticket counts by status"} />
        </button>
        <button className="data-box-btn mt-5" style={{ borderColor: "#ff984e" }} onClick={() => setSelectStat("Priority")}>
          <DataBox heading={String(plen)} text={"Ticket counts by priority"} />
        </button>

      </div>
      <div className="d-flex align-items-start gap-5 justify-content-evenly">
        <div className="charts d-flex flex-column justify-content-center align-items-start">
          <span className="chart-text"><b>What's new with entities</b></span>
          <div className=" d-flex align-items-center justify-content-evenly chart-container">
            <Form.Select size="sm" onChange={(event) => handleChange(event)} value={selectStat}>
              <option value="Owner">Owner</option>
              <option value="Product">Product</option>
              <option value="Status">Status</option>
              <option value="Priority">Priority</option>
            </Form.Select>
            {
              selectStat === "Priority" ? <PieChart chartData={priorityD} className="pie-chart" />
                : (selectStat === "Status" ?
                  <PieChart chartData={statusD} className="pie-chart" />
                  : (
                    selectStat === "Product" ?
                      <PieChart chartData={productData} className="pie-chart" />
                      :
                      <PieChart chartData={ownerD} className="pie-chart" />
                  )
                )
            }
          </div>
        </div>

        {
          selectStat === "Priority" ? <DataView viewData={priorityData} table={selectStat} />
            : (selectStat === "Status" ?
              <DataView viewData={statusData} table={selectStat} />
              : (
                selectStat === "Product" ?
                  <DataView viewData={DepartmentData} table={selectStat} />
                  :
                  <DataView viewData={ownerData} table={selectStat} />
              )
            )
        }
      </div>
    </>

  )
}
