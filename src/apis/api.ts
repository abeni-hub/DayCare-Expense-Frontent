import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Getexp {
    count:number;
    next?:string;
    prev?:string;
    results:{
        id:number;
        items:{
            id:string;
            name:string;
            description:string;
            file_url:string;
            uploaded_at:string;
        }[]
    }[];
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  }),
  endpoints: (builder) => ({
    getPosts: builder.query<Getexp, an>({
      query: () => "posts",
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

export const { useGetPostsQuery } = api;
