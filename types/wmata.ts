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

export interface StationEntrance {
  Description: string;
  ID: string;
  Lat: number;
  Lon: number;
  Name: string;
  StationCode1: string;
  StationCode2: string;
}

export interface StationEntrancesResponse {
  Entrances: StationEntrance[];
}

export interface Line {
  DisplayName: string;
  EndStationCode: string;
  InternalDestination1: string;
  InternalDestination2: string;
  LineCode: string;
  StartStationCode: string;
}

export interface LinesResponse {
  Lines: Line[];
}

export interface RailFare {
  OffPeakTime: number;
  PeakTime: number;
  SeniorDisabled: number;
}

export interface StationToStationInfo {
  CompositeMiles: number;
  DestinationStation: string;
  RailFare: RailFare;
  RailTime: number;
  SourceStation: string;
}

export interface StationToStationInfosResponse {
  StationToStationInfos: StationToStationInfo[];
}
