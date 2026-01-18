import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Item inside an expense
export interface ExpenseItem {
  id: number;
  item_name: string;
  quantity: string;
  unit: string;
  unit_price: string;
  total: string;
}

// Single expense record
export interface Expense {
  id: number;
  items: ExpenseItem[];
  date: string; // ISO date (YYYY-MM-DD)
  description: string;
  category: string;
  supplier: string;
  payment_source: string;
  vat_enabled: boolean;
  vat_rate: string;
  vat_amount: string;
  total_expense: string;
  remarks: string;
  created_at: string; // ISO datetime
}

// API paginated response
export interface ExpenseResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Expense[];
}


export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api",
  }),
  endpoints: (builder) => ({
    getPosts: builder.query<ExpenseResponse,void>({
      query: () => ({
        url: '/expenses/',
        method: 'GET',
      }),
    }),
    createpost :builder.mutation({
      query: (newPost) => ({
        url: 'posts',
        method: 'POST',
        body: newPost,
      }),
    }),
  }),

});

export const { useGetPostsQuery,useCreatepostMutation } = api;
