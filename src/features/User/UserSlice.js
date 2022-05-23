//This page contain middleware and reducers.


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'users/login',
  async ({ email, password }, thunkAPI) => {
    const reqBody = {
      userName: email,
      password
    }
    console.log("Request Login", reqBody)
    try {
      const response = await fetch(
        'http://lala44-001-site1.itempurl.com/api/UserLogin/Userlogin',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqBody),
        }
      );
      let data = await response.json();
      console.log('response', data);
      if (response.status === 200) {
        alert(`login success, Wecome ${email} ${data}`)
        localStorage.setItem('token', data);
        return data;
      } else {
        // alert("Error Login", data)

        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      alert("Error Login", e.response.data)
      thunkAPI.rejectWithValue(e.response.data);
    }
  }
);


//hardcoded company ID and userID because api did not work by token.

export const fetchUserBytoken = createAsyncThunk(
  'users/fetchUserByToken',
  async ({ token }, thunkAPI) => {
    try {
      const response = await fetch(
        'http://lala44-001-site1.itempurl.com/api/User/get-detail/3',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            CompanyId: 1,
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );
      let data = await response.json();
      console.log('data', data, response.status);


      if (response.status === 200) {
        return { ...data };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      console.log('Error', e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    firstName: '',
    password: '',
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
  },
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;

      return state;
    },
  },

  //these are middleware thunk reducers peforming 3 types of actions.
  extraReducers: {
    [loginUser.fulfilled]: (state, { payload }) => {
      console.log("Reducer Payload", payload)
      state.email = payload.email;
      state.firstName = payload.firstName;
      state.isFetching = false;
      state.isSuccess = true;
      return state;
    },
    [loginUser.rejected]: (state, { payload }) => {
      console.log('payload', payload);
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = 'Error login: ' + payload;
    },
    [loginUser.pending]: (state) => {
      state.isFetching = true;
    },
    [fetchUserBytoken.pending]: (state) => {
      state.isFetching = true;
    },
    [fetchUserBytoken.fulfilled]: (state, { payload }) => {
      console.log("Reducer Payload", payload)

      state.isFetching = false;
      state.isSuccess = true;
      state.email = payload.email;
      state.firstName = payload.usr_FName;
      state.lastName = payload.usr_LName;
    },
    [fetchUserBytoken.rejected]: (state) => {
      console.log('fetchUserBytoken');
      state.isFetching = false;
      state.isError = true;
    },
  },
});

export const { clearState } = userSlice.actions;

export const userSelector = (state) => state.user;
