export interface StationAddress {
  City: string;
  State: string;
  Street: string;
  Zip: string;
}

export interface StationInfo {
  Address: StationAddress;
  Code: string;
  Lat: number;
  Lon: number;
  LineCode1: string;
  LineCode2: string | null;
  LineCode3: string | null;
  LineCode4: string | null;
  Name: string;
  StationTogether1: string;
  StationTogether2: string;
}

export interface StationsResponse {
  Stations: StationInfo[];
}

export interface StationParking {
  Code: string;
  Notes: string | null;
  AllDayParking: {
    TotalCount: number;
    RiderCost: number | null;
    NonRiderCost: number | null;
  };
  ShortTermParking: {
    TotalCount: number;
    Notes: string | null;
  };
}

export interface StationsParkingResponse {
  StationsParking: StationParking[];
}

export interface TrainTime {
  Time: string;
  DestinationStation: string;
}

export interface DaySchedule {
  OpeningTime: string;
  FirstTrains: TrainTime[];
  LastTrains: TrainTime[];
}

export interface StationTime {
  Code: string;
  StationName: string;
  Monday: DaySchedule;
  Tuesday: DaySchedule;
  Wednesday: DaySchedule;
  Thursday: DaySchedule;
  Friday: DaySchedule;
  Saturday: DaySchedule;
  Sunday: DaySchedule;
}

export interface StationTimesResponse {
  StationTimes: StationTime[];
}

export interface NextTrainInfo {
  Car: string | null;
  Destination: string;
  DestinationCode: string | null;
  DestinationName: string;
  Group: string;
  Line: string;
  LocationCode: string;
  LocationName: string;
  Min: string;
}

export interface StationPredictionsResponse {
  Trains: NextTrainInfo[];
}

export interface RailIncident {
  DateUpdated: string;
  DelaySeverity: string | null;
  Description: string;
  EmergencyText: string | null;
  EndLocationFullName: string | null;
  IncidentID: string;
  IncidentType: string;
  LinesAffected: string;
  PassengerDelay: number;
  StartLocationFullName: string | null;
}

export interface RailIncidentsResponse {
  Incidents: RailIncident[];
}
