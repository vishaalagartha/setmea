import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from './rootReducer'
import type { IUser } from '../types/user'

const initialState = {
  _id: '',
  username: '',
  identity: undefined,
  email: '',
  height: undefined,
  weight: undefined,
  apeIndex: undefined,
  avatar: '',
  location: ''
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
