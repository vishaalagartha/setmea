import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from './rootReducer'

interface IUser {
  _id: string
  username: string
}

const initialState = {
  _id: '',
  username: ''
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        ...action.payload
      }
    },
    resetUser: () => {
      return { ...initialState }
    }
  }
})

export const { setUser, resetUser } = userSlice.actions
export const userSelector = (state: RootState): IUser => state.user
export default userSlice.reducer
