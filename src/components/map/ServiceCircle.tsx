import { Circle } from "@react-google-maps/api";

type ServiceCircleProps = {
  lat: number;
  lng: number;
};

export const ServiceCircle = ({ lat, lng }: ServiceCircleProps) => (
  <Circle
    center={{ lat, lng }}
    radius={5000}
    options={{
      fillOpacity: 0.1,
      fillColor: "#FF6C4F",
      strokeColor: "#FF6C4F",
    }}
  />
);
