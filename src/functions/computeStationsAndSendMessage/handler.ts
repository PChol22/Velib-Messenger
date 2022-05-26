import { middyfy } from '@libs/lambda';
import fetch from 'node-fetch';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns'

type StationInformation = {
  station_id: number,
  name: string,
  lat: number,
  lon: number,
  capacity: number,
  rental_methods: string[],
  stationCode: string,
}

type StationStatus = {
  station_id: number,
  stationCode: string,
  numBikesAvailable: number,
  num_bikes_available_types: [
    { mechanical: number },
    { ebike: number },
  ],
  numDocksAvailable: number,
  is_renting: number,
  is_returning: number,
  is_installed: number,
}

type Station = StationInformation & StationStatus;

type StationResult = {
  distance: number,
  bikes: number,
  name: string,
};

const distanceToStation = (station: Station, lat: number, lon: number): number => {
  return Math.pow(lat - station.lat, 2) + Math.pow(lon - station.lon, 2);
};

const getClosestStations = (stations: Station[], lat: number, lon: number, n: number = 3) => {
  const stationsDistances = stations.map(station => ({
    ...station,
    distance: distanceToStation(station, lat, lon),
  }));
  const orderedStationsDistance = stationsDistances.sort((a,b) => (a.distance - b.distance));
  return orderedStationsDistance.slice(0, n);
};

const formatMessage = (stations: StationResult[]) => {
  let message = 'Hello! Available Velib Stations :\n';

  for (let station of stations) {
    message = message.concat(`- ${station.name}: ${station.bikes} bikes, ${station.distance} m\n`);
  }
  return message;
};

const computeStationsAndSendMessage = async (event: { Records: { body: string }[] }) => {  
  
  const [stationsInformations, stationsStatus] = await Promise.all([
    fetch('https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_information.json')
      .then(r => r.json())
      .then((r: { data: { stations: StationInformation[] } }) => r.data.stations),
    fetch('https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_status.json')
      .then(r => r.json())
      .then((r: { data: { stations: StationStatus[] } }) => r.data.stations)
  ]);
    
  const stationsIdsToStatus: {[id: string]: StationStatus } = Object.assign({}, ...stationsStatus.map(station => ({ [station.stationCode]: station })));

  const stations: Station[] = stationsInformations.map(station => ({
    ...station,
    ...stationsIdsToStatus[station.stationCode],
  }));

  const interestingStations = stations.filter(station => station.numBikesAvailable > 5);


  for (const record of event.Records) {
    const { lat, lon, email } = JSON.parse(record.body) as { lat: number, lon: number, email: string }
    const closestStations = getClosestStations(interestingStations, lat, lon).map(station => ({
      distance: Math.round(Math.sqrt(station.distance) * 40_000_000 / 360),
      bikes: station.numBikesAvailable,
      name: station.name,
    }));
  
    const client = new SNSClient({
      region: 'eu-west-1',
    });
  
    const command = new PublishCommand({
      TopicArn: process.env.SMS_TOPIC_ARN,
      Message: formatMessage(closestStations),
      MessageAttributes: {
        email: {
          DataType: 'String',
          StringValue: email,
        }
      }
    });
  
    const result = await client.send(command);
    console.log(result);
  }
};

export const main = middyfy(computeStationsAndSendMessage);
