import { request } from "@playwright/test";
import { API_BASE_URL } from '../playwright.config.js';
import { getAccessToken } from "./tokenHelper.js";

export async function getDataFromApi(endpoint, role = "admin", params = {}) {
   const token = getAccessToken(role);
   if (!token) {
      throw new Error('No auth token found for admin');
   }

   const apiContext = await request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json',
      },
   })

   const response = await apiContext.fetch(endpoint, {
      method: 'GET',
      params: params
   });
   if (!response.ok()) {
      throw new Error(`API request failed with status ${response.status()}: ${response.statusText()}`);
   }
   return await response.json();
}