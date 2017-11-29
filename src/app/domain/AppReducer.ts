import {combineReducers} from 'redux'
// import {routerReducer as RouterReducer} from 'react-router-redux'

import {handleActions} from 'redux-actions'

const INITIAL_STATE = {
	number: 0,
}

const TestReducer = handleActions(
	{

		['INCREMENT']: (state: any, action: any) => {
			return {...state, number: state.number + 1}
		},

		['DECREMENT']: (state: any, action: any) => {
			return {...state, number: state.number - 1}
		},

	},
	INITIAL_STATE,
)

export const AppReducer = combineReducers({
	// routing: RouterReducer,
	test: TestReducer,
})
