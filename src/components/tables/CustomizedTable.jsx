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
} from "@fortawesome/free-solid-svg-icons";
import GlobalFilter from "../search-filters/GlobalFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import tableMeta from "../../Database/table-meta.json";
import ColumnFilter from "../search-filters/ColumnFilter";
import { Checkbox } from "../checkbox/Checkbox";
import { useSelector } from "react-redux";
import TicketPopup from "../popups/TicketPopup";

const CustomizedTable = () => {
  const [showTicketPopup, setShowTicketPopup] = useState(false);
  const tableFields = useSelector((state) => {
    return state.table.tableCols;
  });
  const ticketCols = tableMeta.results[0].applicationTable.dataFields.map(
    (ticketCol) => {
      return { Header: ticketCol.label, accessor: ticketCol.field };
    }
  );
  // eslint-disable-next-line
  const ticketColumns = useMemo(() => ticketCols, []);

  // eslint-disable-next-line
  const ticketData = useMemo(() => tableFields, []);

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
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    allColumns,
    getToggleHideAllColumnsProps,
  } = useTable(
    {
      columns: ticketColumns,
      data: ticketData,
      defaultColumn,

      // initialState: {
      //   hiddenColumns:["accesorName"]
      //   }
      initialState: {
        hiddenColumns: [
          "reportType",
          "ticket.modifiedtime",
          "ticket.creationtime",
          "ticket.ticketTitle",
          "creationtime",
          "modifiedtime",
          "ticket.ticketCreator.fullName",
          "ticket.ticketCustomer.organizationName",
          "ticket.ticketEndCustomer.organizationName",
          "ticket.ticketOwner.fullName",
          "ticket.meta.serverVersion",
          "ticket.meta.clusterId",
          "ticket.meta.platform",
          "ticket.meta.component",
          "ticket.meta.legacyId",
          "ticket.meta.dhfVersion",
          "ticket.meta.opsVersion",
          "ticket.meta.cloudServiceId",
          "ticket.meta.cloudMlaasId",
          "ticket.meta.cloudPlatform",
          "ticket.meta.dhsVersion",
          "ticket.meta.environment",
          "ticket.meta.issueNumber",
        ],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const { globalFilter, pageIndex, pageSize } = state;
  return (
    <>
      <div className="d-flex justify-content-between my-3 mt-5 px-2">
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        <div
          className="d-flex gap-5 justify-content-center"
          style={{ width: "350px" }}
        >
          <div className="checkbox d-flex">
            <Checkbox {...getToggleHideAllColumnsProps()} id="all-hidden" />
            <label htmlFor="all-hidden">Toggle All</label>
          </div>
          <FontAwesomeIcon
            icon={faGear}
            onClick={() => setShowTicketPopup(true)}
            style={{ cursor: "pointer" }}
            className="fa-2x mx-3"
          />
        </div>
      </div>
      <table {...getTableProps()} className="react-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header") + "  "}
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <FontAwesomeIcon icon={faSortUp} />
                    ) : (
                      <FontAwesomeIcon icon={faSortDown} />
                    )
                  ) : (
                    ""
                  )}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
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
      <div>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <span>
          | Go To Page{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const pageNumber = e.target.value
                ? Number(e.target.value) - 1
                : 0;
              gotoPage(pageNumber);
            }}
            min={pageIndex + 1}
            max={pageOptions.length}
            style={{ width: "50px" }}
          />
        </span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="select-btn mx-2"
        >
          {[10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        <button
          className={!canPreviousPage ? "disable-btn" : "main-btn"}
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>
        <button
          className={!canPreviousPage ? "disable-btn" : "main-btn"}
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          Previous
        </button>
        <button
          className={!canNextPage ? "disable-btn" : "main-btn"}
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          Next
        </button>
        <button
          className={!canNextPage ? "disable-btn" : "main-btn"}
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>
      </div>
      <TicketPopup
        allColumns={allColumns}
        showPopup={showTicketPopup}
        setShowPopup={setShowTicketPopup}
      />
    </>
  );
};

export default CustomizedTable;
