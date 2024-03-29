import { runtimeTypes } from "./runtimeTypes";

const initialState = {
  tableHiddenCols: [
    "reportType",
    // "reportCreator",
    // "ticket.ticketCreator",
    // "ticket.ticketCustomer",
    // "ticket.ticketEndCustomer",
    // "ticket.ticketOwner",
    // "ticket.ticketLastreplier.fullName",
    "ticketId",
    "ticket.modifiedtime",
    "ticket.creationtime",
    "ticket.ticketTitle",
    "ticket.ticketType",
    "ticket.meta.flagtype",
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
    "survey.collateralComment",
    "survey.shipmentDetailsComment",
  ],
  search: {
    value: '',
    type: 'string'
  },
  columnsort: {},
  initialResults: {},
  results: {},
  error: "",
};

export const runtimeReducer = (state = initialState, action) => {
  switch (action.type) {
    case runtimeTypes.FETCH_RUNTIME_REQUEST:
      return {
        ...state,
      };
    case runtimeTypes.UPDATE_RESET_FACET:
      return {
        ...state,
        results: { ...state.results, facets: action.payload },
      };
    case runtimeTypes.FETCH_RUNTIME_SUCCESS:
      return {
        ...state,
        results: action.payload,
        error: "",
      };
    case runtimeTypes.FETCH_RUNTIME_UPDATE:
      return {
        ...state,
        results: action.payload,
        error: "",
      };
    case runtimeTypes.ADD_RUNTIME_HIDDENCOLS:
      return {
        ...state,
        tableHiddenCols: [...state.tableHiddenCols, action.payload],
      };
    case runtimeTypes.REMOVE_RUNTIME_HIDDENCOLS:
      const newTableHiddenCols = state.tableHiddenCols.filter(
        (col) => col !== action.payload
      );
      return {
        ...state,
        tableHiddenCols: newTableHiddenCols,
      };
    case runtimeTypes.TOGGLE_RUNTIME_SELECT:
      return {
        ...state,
        results: action.payload,
        error: "",
      };
    case runtimeTypes.INITIALIZE_COLUMN_SORT:
      return {
        ...state,
        columnsort: action.payload,
        error: "",
      };
    case runtimeTypes.CHANGE_COLUMN_SORT:
      return {
        ...state,
        columnsort: action.payload,
        error: "",
      };
    case runtimeTypes.UPDATE_SEARCH:
      return {
        ...state,
        search: action.payload,
        error: "",
      };
    case runtimeTypes.FETCH_RUNTIME_FAILURE:
      return {
        ...state,
        results: {},
        error: action.payload,
      };
    default:
      return state;
  }
};
