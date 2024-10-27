import { createAsyncThunk } from "@reduxjs/toolkit";
import * as bannerService from "../Services/banner.services";

export const postBannerAction = createAsyncThunk(
  "banner/new",
  async ({ data, cb }: { data: any; cb: () => void }, thunkApi) => {
    try {
      const response = await bannerService.addBanner(data);
      cb();
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue("Error while posting new banner");
    }
  }
);
