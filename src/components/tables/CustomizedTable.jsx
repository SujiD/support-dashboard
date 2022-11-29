import { useMemo, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
} from "react-table";
import {
  faSortUp,
  faSortDown,
  faGear,
  faFilter,
  faAsterisk,
} from "@fortawesome/free-solid-svg-icons";
import GlobalFilter from "../search-filters/GlobalFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ColumnFilter from "../search-filters/ColumnFilter";
import { Checkbox } from "../checkbox/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import TicketPopup from "../popups/TicketPopup";
import { colors } from "../../Database/Data";
import PieChartPopup from "../popups/PieChartPopup";
import APIClient from "../../api/APIClient";
import { useContext } from "react";
import { ErrorContext } from "../../contexts/ErrorContext";
import {
  fetchFacetsSuccess,
  fetchFacetsUpdate,
} from "../../redux/facet/facetActions";
import {
  updatePageDataNextPrev,
  updatePageDataPageSize,
} from "../../redux/page/pageActions";
import { useEffect } from "react";
import { CSVLink } from "react-csv";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  changeColSortRuntime,
  initializeColumnSort,
} from "../../redux/runtime/runtimeActions";

const CustomizedTable = ({ loading, setLoading }) => {
  const [showTicketPopup, setShowTicketPopup] = useState(false);
  const [facetData, setFacetData] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [facetId, setFacetId] = useState("");
  const [csvData, setCSVData] = useState([]);
  const [tableFields, setTableFields] = useState([]);
  const [apiClient] = useState(() => new APIClient());
  const { setError } = useContext(ErrorContext);
  const dispatch = useDispatch();

  const facetTableData = useSelector((state) => {
    return state.facet.facets;
  });

  const pageStoreData = useSelector((state) => {
    return state.pageData;
  });

  const runtimeHiddenCols = useSelector((state) => {
    return state.runtime.tableHiddenCols;
  });

  const runTimeResults = useSelector((state) => {
    return state.runtime.results;
  });

  const columnChanges = useSelector((state) => {
    return state.column.columns;
  });

  const columnSorting = useSelector((state) => {
    return state.runtime.columnsort;
  });

  useEffect(() => {
    setLoading(true);
    apiClient.entityService
      .getTableFields()
      .then((res) => {
        setTableFields(res.data.data.dataFields);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
    setLoading(false);
  }, [apiClient.entityService, setError, setLoading]);

  const ticketCols = tableFields.map((ticketCol) => {
    return {
      Header: ticketCol.label,
      name: ticketCol.name,
      accessor: ticketCol.field,
      disableSortBy: true,
      maxWidth: 600,
      sort: "default",
    };
  });

  // eslint-disable-next-line
  const columns = useMemo(() => ticketCols, [tableFields]);
  // eslint-disable-next-line
  const ticketData = useMemo(() => facetTableData.results, []);

  const defaultColumn = useMemo(() => {
    return {
      Filter: ColumnFilter,
    };
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    setPageSize,
    allColumns,
    visibleColumns,
    getToggleHideAllColumnsProps,
  } = useTable(
    {
      columns: columns,
      data: ticketData,
      defaultColumn,
      initialState: {
        hiddenColumns: runtimeHiddenCols,
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const csvHelper = () => {
    let finalArray = [];
    if (visibleColumns && visibleColumns.length > 0) {
      visibleColumns[0].filteredRows.forEach((row) => {
        prepareRow(row);
        if (row) {
          let rowObject = {};
          row.cells.forEach((cell) => {
            rowObject[cell.column.Header] = cell.value;
          });
          finalArray.push(rowObject);
        }
      });
      setCSVData(finalArray);
    }
  };

  useEffect(() => {
    csvHelper();
    initiateColumnSort(visibleColumns);
    // console.log(columnSorting)
    // eslint-disable-next-line
  }, [visibleColumns]);

  useEffect(() => {
    setPageSize(pageStoreData.pageSize);
  }, [pageStoreData.pageSize, setPageSize]);

  const { globalFilter } = state;

  const handleFilter = (columnName) => {
    const facetValues = facetTableData.facets[columnName.name]?.values;
    const runtimeFacetValues = runTimeResults.facets[columnName.name]?.values;
    if (facetValues && runtimeFacetValues) {
      const x = Object.values(runtimeFacetValues);
      const y = Object.values(facetValues);
      const r = x.filter((elem) => !y.find(({ text }) => elem.text === text));
      if (r.length > 0) {
        r.forEach((facet) => {
          facet.currentCount = 0;
          y.push(facet);
        });
      }
      if (y && Object.keys(y).length > 0) {
        setTitle(columnName.Header);
        setFacetId(columnName.name);
        setFacetData({
          labels: Object.values(y).map((value) => value.text), // ['yes', 'no']
          datasets: [
            {
              label: columnName.Header,
              data: Object.values(y).map((value) => value.currentCount),
              backgroundColor: colors.map((color) => color),
              borderColor: colors.map((color) => color),
              borderWidth: 1,
              hoverOffset: 6,
              hoverBorderColor: "#000",
            },
          ],
        });
        setShowPopup(true);
      } else {
        alert("No facets to show");
      }
    } else {
      alert("No facets to show");
    }
  };

  let reqBody = {
    appPath: "Report",
    q: "0ca72f154fc71e0bc6fa75772b925e7c-reportType:survey",
    start: "1",
    view: "all",
  };

  const handlePageSize = (e) => {
    paginationHelper(
      pageStoreData.next,
      pageStoreData.prev,
      e.target.value,
      "pageSize"
    );
  };

  const paginationHelper = (next, prev, start, type) => {
    let func;
    if (type === "pageSize") {
      func = updatePageDataPageSize;
      reqBody.pageLength = start;
    } else {
      func = updatePageDataNextPrev;
      reqBody.start = `${start}`;
      reqBody.pageLength = `${pageStoreData.pageSize}`;
    }
    setLoading(true);
    reqBody.facets = runTimeResults.facets;
    apiClient.entityService
      .getAllSearchData(reqBody)
      .then((res) => {
        dispatch(
          func({
            pageSize:
              type === "pageSize"
                ? res.data["page-length"]
                : pageStoreData.pageSize,
            totalLength: res.data.total,
            numOfPages:
              type === "pageSize"
                ? Math.ceil(res.data.total / res.data["page-length"])
                : Math.ceil(res.data.total / pageStoreData.pageSize),
            next: next,
            prev: prev,
            start: res.data.start,
          })
        );
        if (Object.keys(res.data.facets).length > 0) {
          dispatch(fetchFacetsSuccess(res.data));
          dispatch(fetchFacetsUpdate(res.data));
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };
  const handleNextPage = () => {
    if (pageStoreData.next !== pageStoreData.numOfPages) {
      paginationHelper(
        pageStoreData.next + 1,
        pageStoreData.prev + 1,
        pageStoreData.start + pageStoreData.pageSize,
        "pagination"
      );
    }
  };

  const gotoLastPage = () => {
    paginationHelper(
      pageStoreData.numOfPages,
      pageStoreData.numOfPages,
      Math.floor(pageStoreData.totalLength / pageStoreData.pageSize) *
        pageStoreData.pageSize +
        1,
      "pagination"
    );
  };

  const gotoStartPage = () => {
    if (pageStoreData.prev !== 0) {
      paginationHelper(1, 1, 1, "pagination");
    }
  };

  const handlePrevPage = () => {
    if (pageStoreData.prev !== 1) {
      paginationHelper(
        pageStoreData.next - 1,
        pageStoreData.prev - 1,
        pageStoreData.start - pageStoreData.pageSize,
        "pagination"
      );
    }
  };

  const initiateColumnSort = (visibleCols) => {
    let initialObj = {};
    visibleCols.forEach((cols) => {
      initialObj[cols.name] = "default";
    });
    dispatch(initializeColumnSort(initialObj));
  };

  const changeColumnSort = (columnName) => {
    if (columnSorting[columnName] === "default") {
      columnSorting[columnName] = "asc";
      dispatch(changeColSortRuntime(columnSorting));
      return "asc";
    } else if (columnSorting[columnName] === "asc") {
      columnSorting[columnName] = "desc";
      dispatch(changeColSortRuntime(columnSorting));
      return "desc";
    } else {
      columnSorting[columnName] = "default";
      dispatch(changeColSortRuntime(columnSorting));
      return "default";
    }
  };

  const handleSorting = (column) => {
    setLoading(true);
    // if (column.sort === "default") {
    //   changeColumnSort(column.name, "asc");
    //   obj[`${column.name}`] = "asc";
    //   column.sort = "asc";
    // } else if (column.sort === "asc") {
    //   obj[`${column.name}`] = "desc";
    //   column.sort = "desc";
    // } else {
    //   obj[`${column.name}`] = "default";
    //   column.sort = "default";
    // }
    let obj = {};
    obj[column.name] = changeColumnSort(column.name);
    reqBody.sort = obj;
    apiClient.entityService
      .getAllSearchData(reqBody)
      .then((res) => {
        if (Object.keys(res.data.facets).length > 0) {
          dispatch(fetchFacetsSuccess(res.data));
          dispatch(fetchFacetsUpdate(res.data));
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };
  return (
    <>
      <div className="d-flex justify-content-evenly my-3 mt-5 px-2">
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        <div
          className="d-flex gap-5 justify-content-center align-items-center"
          style={{ width: "40%" }}
        >
          <div className="checkbox d-flex mt-3">
            <Checkbox {...getToggleHideAllColumnsProps()} id="all-hidden" />
            <label htmlFor="all-hidden">Toggle All</label>
          </div>
          <FontAwesomeIcon
            icon={faGear}
            onClick={() => setShowTicketPopup(true)}
            style={{ cursor: "pointer" }}
            className="fa-2x mx-3"
          />
          {visibleColumns.length > 0 ? (
            <CSVLink
              data={csvData}
              filename={"support-status-report"}
              className="download-icon"
            >
              Export CSV
            </CSVLink>
          ) : null}
        </div>
      </div>
      <div style={{ overflow: "auto" }}>
        <table {...getTableProps()} className="react-table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(
                      column.getSortByToggleProps({ title: undefined })
                    )}
                    className="position-relative"
                    style={{ cursor: "pointer" }}
                  >
                    {columnChanges &&
                      columnChanges.map((cols, index) => {
                        if (
                          cols.id === column.name &&
                          cols.changes.length > 0
                        ) {
                          return (
                            <OverlayTrigger
                              placement="top"
                              overlay={(props) => (
                                <Tooltip className="my-tooltip" {...props}>
                                  {cols.changes}
                                </Tooltip>
                              )}
                              key={index}
                            >
                              <span
                                style={{
                                  opacity: 0,
                                  position: "absolute",
                                  left: 0,
                                }}
                              >
                                {column.render("Header")}
                              </span>
                            </OverlayTrigger>
                          );
                        } else {
                          return null;
                        }
                      })}
                    <span key={column.id} onClick={() => handleSorting(column)}>
                      {column.render("Header")}
                    </span>
                    <FontAwesomeIcon
                      icon={faFilter}
                      className="ms-1"
                      onClick={() => handleFilter(column)}
                    />
                    {columnChanges.map((cols, index) => {
                      if (cols.id === column.name && cols.changes.length > 0) {
                        return (
                          <FontAwesomeIcon
                            icon={faAsterisk}
                            key={index}
                            className="ms-1 fa-1x"
                          />
                        );
                      } else {
                        return null;
                      }
                    })}
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <FontAwesomeIcon icon={faSortUp} />
                      ) : (
                        <FontAwesomeIcon icon={faSortDown} />
                      )
                    ) : (
                      ""
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.length > 0 &&
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
        {page.length > 0 && visibleColumns.length !== 0 ? null : (
          <span>Sorry no results found!!</span>
        )}
      </div>
      {page.length > 0 && visibleColumns.length !== 0 && (
        <div>
          <span>
            Page{" "}
            <strong>
              {pageStoreData.next} of{" "}
              {pageStoreData.numOfPages === 0
                ? 1
                : isNaN(pageStoreData.numOfPages)
                ? 0
                : pageStoreData.numOfPages}
            </strong>
          </span>
          <select
            value={pageStoreData.pageSize}
            onChange={(e) => handlePageSize(e)}
            className="select-btn mx-2"
          >
            {[10, 25, 50].map((size) => (
              <option
                key={size}
                value={size}
                disabled={!(pageStoreData.totalLength >= size)}
              >
                Show {size}
              </option>
            ))}
          </select>
          <button
            className={pageStoreData.prev === 1 ? "disable-btn" : "main-btn"}
            // className="main-btn"
            onClick={gotoStartPage}
            disabled={pageStoreData.prev === 1}
          >
            {"<<"}
          </button>
          <button
            className={pageStoreData.prev === 1 ? "disable-btn" : "main-btn"}
            // className="main-btn"
            onClick={handlePrevPage}
            disabled={pageStoreData.prev === 1}
          >
            Previous
          </button>
          <button
            className={
              pageStoreData.next ===
              (pageStoreData.numOfPages === 0
                ? pageStoreData.numOfPages + 1
                : pageStoreData.numOfPages)
                ? "disable-btn"
                : "main-btn"
            }
            // className="main-btn"
            onClick={handleNextPage}
            disabled={
              pageStoreData.next ===
              (pageStoreData.numOfPages === 0
                ? pageStoreData.numOfPages + 1
                : pageStoreData.numOfPages)
            }
          >
            Next
          </button>
          <button
            className={
              pageStoreData.next ===
              (pageStoreData.numOfPages === 0
                ? pageStoreData.numOfPages + 1
                : pageStoreData.numOfPages)
                ? "disable-btn"
                : "main-btn"
            }
            // className="main-btn"
            onClick={gotoLastPage}
            disabled={
              pageStoreData.next ===
              (pageStoreData.numOfPages === 0
                ? pageStoreData.numOfPages + 1
                : pageStoreData.numOfPages)
            }
          >
            {">>"}
          </button>
        </div>
      )}
      <TicketPopup
        allColumns={allColumns}
        showPopup={showTicketPopup}
        setShowPopup={setShowTicketPopup}
      />
      <PieChartPopup
        facetData={facetData}
        size="lg"
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        title={title}
        id={facetId}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
};

export default CustomizedTable;
