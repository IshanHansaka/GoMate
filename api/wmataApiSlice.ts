import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const wmataApiKey = process.env.EXPO_PUBLIC_WMATA_API_PRIMARY_KEY;

export const wmataApiSlice = createApi({
  reducerPath: 'wmataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.wmata.com',
    prepareHeaders: (headers) => {
      if (wmataApiKey) {
        headers.set('api_key', wmataApiKey);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getStationInfo: builder.query({
      query: (stationCode) =>
        `/Rail.svc/json/jStationInfo?StationCode=${stationCode}`,
    }),
    getStations: builder.query({
      query: () => '/Rail.svc/json/jStations',
    }),
    getStationParking: builder.query({
      query: (stationCode) =>
        `/Rail.svc/json/jStationParking?StationCode=${stationCode}`,
    }),
    getStationTimes: builder.query({
      query: (stationCode) =>
        `/Rail.svc/json/jStationTimes?StationCode=${stationCode}`,
    }),
    getStationPredictions: builder.query({
      query: (stationCode) =>
        `/StationPrediction.svc/json/GetPrediction/${stationCode}`,
    }),
    getRailIncidents: builder.query({
      query: () => '/Incidents.svc/json/Incidents',
    }),
  }),
});

export const {
  useGetStationInfoQuery,
  useGetStationsQuery,
  useGetStationParkingQuery,
  useGetStationTimesQuery,
  useGetStationPredictionsQuery,
  useGetRailIncidentsQuery,
} = wmataApiSlice;
