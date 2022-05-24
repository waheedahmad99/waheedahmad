import {
   GET_TRUST_LIST,
   GET_TRUST,
   GET_TRUST_OWNERSHIP,
   GET_FAMILY_HISTORY,
   GET_MARKETING_HISTORY,
   GET_TAXES,
   GET_INSURANCE,
   GET_CHATTER,
   GET_TRUST_OPTIONS,
   GET_TRUST_ADDRESS,
   UPDATE_TRUST_LIST,
   ADD_TRUST_LIST
} from './actions';

export const initialState = {
   trustList: {},
   trust: {},
   trustOptions: {},
   trustOwnership: {},
   familyHistory: {},
   marketingHistory: {},
   taxes: {},
   insurance: {},
   chatterList: [],
   addresses: [],
};

const trustReducer = (state = initialState, action) => {
   switch (action.type) {
      case GET_TRUST_LIST:
         return {
            ...state,
            trustList: action.payload,
         };
       case ADD_TRUST_LIST:
          return {
            ...state,
            trustList:{...state.trustList,...action.payload}
          }
         case UPDATE_TRUST_LIST:
            return {
                ...state,
                trustList:{
                    ...state.trustList,
                    ...action.payload}
            };
      case GET_TRUST:
         return { ...state, trust: action.payload };

      case GET_TRUST_ADDRESS:
         return { ...state, addresses: action.payload };

      case GET_TRUST_OPTIONS:
         return { ...state, trustOptions: action.payload };

      case GET_CHATTER:
         return { ...state, chatterList: action.payload };

      case GET_TRUST_OWNERSHIP:
         return { ...state, trustOwnership: action.payload };

      case GET_FAMILY_HISTORY:
         return { ...state, familyHistory: action.payload };

      case GET_MARKETING_HISTORY:
         return { ...state, marketingHistory: action.payload };

      case GET_TAXES:
         return { ...state, taxes: action.payload };

      case GET_INSURANCE:
         return { ...state, insurance: action.payload };

      default:
         return state;
   }
};

export default trustReducer;
