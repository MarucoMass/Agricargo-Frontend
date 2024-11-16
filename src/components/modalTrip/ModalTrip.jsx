// ModalTrip.js
import { useState, useEffect } from "react";
import Button from "../button/Button";
import Input from "../../components/input/Input";

const ModalTrip = ({ onClose, onSubmit, edit = false, trip = {} }) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [arriveDate, setArriveDate] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (edit && trip) {
      setOrigin(trip.origin || "");
      setDestination(trip.destination || "");
      setDepartureDate(trip.departureDate?.split("T")[0] || "");
      setArriveDate(trip.arriveDate?.split("T")[0] || "");
      setPrice(trip.price || "");
    }
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      origin,
      destination,
      departureDate,
      arriveDate,
      pricePerTon: parseFloat(price)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-md shadow-md">
        <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
          <h2 className="text-black dark:text-white">Datos del viaje</h2>
          <div className="flex flex-col lg:flex-row gap-4">
            <Input value={origin} setInputValue={setOrigin}>
              Origen
            </Input>
            <Input value={destination} setInputValue={setDestination}>
              Destino
            </Input>
            <Input
              value={departureDate}
              type="date"
              setInputValue={setDepartureDate}
            >
              Fecha de salida
            </Input>
            <Input value={arriveDate} type="date" setInputValue={setArriveDate}>
              Fecha de llegada
            </Input>
            <Input value={price} type="number" setInputValue={setPrice}>
              Precio por tonelada
            </Input>
          </div>
          <div className="flex gap-4">
            <Button
              typeButton="button"
              className="px-5 rounded-lg"
              bgColor="bg-red-600"
              hoverColor="hover:bg-red-700"
              actionClick={onClose}
            >
              Cancelar
            </Button>
            <Button typeButton="submit" className="px-5 rounded-lg">
              {edit ? "Guardar cambios" : "Agregar viaje"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalTrip;
