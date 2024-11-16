import { useState } from "react";
import Button from "../button/Button";
import useFetchData from "../../hooks/useFetchData/UseFetchData";
import { useAuthContext } from "../context/AuthProvider";
import ReusableTable from "../tables/ReusableTable";
import { useNavigate } from "react-router-dom";
import ModalTrip from "../modalTrip/ModalTrip";


const ShipCard = ({ ship, onDelete, setMessage, setFetchModal }) => {
  const [openShipId, setOpenShipId] = useState(null);
  const { userProfile } = useAuthContext();
  const { data: trips, setData: setTrips } = useFetchData(
    `https://localhost:7183/Trip/getTripsOfShip?id=${ship.id}`,
    userProfile.token
  );
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(true);
  const [trip, setTrip] = useState({});
  const navigate = useNavigate();

  const toggleAccordion = (id) => {
    setOpenShipId(openShipId === id ? null : id);
  };

  const statusStyles = {
    Finalizado: "bg-red-100 text-red-800",
    "En camino": "bg-green-100 text-green-800",
    Pendiente: "bg-yellow-100 text-yellow-800",
    Disponible: "bg-green-100 text-green-800",
    Ocupado: "bg-red-100 text-red-800",
  };

  const editTrip = (selectedTrip) => {
    setTrip(selectedTrip);
    setShowModal(true);
    setEdit(true);
  };

  const removeTrip = async (item) => {
    try {
      const response = await fetch(
        `https://localhost:7183/Trip/deleteTrip/${item.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userProfile.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud: " + (await response.json()));
      }

      const filteredTrips = trips.filter((trips) => trips.id != item.id);
      setTrips(filteredTrips);
    } catch (error) {
       setMessage(error.message);
       setFetchModal(true);
       console.error("Error:", error);
      }
  };

  const handleEdit = (ship) => {
    navigate(`/empresa/modificar-barco/${ship.id}`, {
      state: {
        ship: {
          capacity: ship.capacity,
          typeShip: ship.typeShip,
          captain: ship.captain,
          shipPlate: ship.shipPlate,
          idShip: ship.id,
        },
      },
    });
  };

  const handleCreateTrip = () => {
    setShowModal(true);
    setEdit(false);
  };

  const handleSubmit = async (newTrip) => {
    const tripData = {
      ...newTrip,
      ...(edit ? {} : { shipId: ship.id }),
    };

    console.log(trips);
    try {
      const url = edit
        ? `https://localhost:7183/Trip/updateTrip/${trip.id}`
        : "https://localhost:7183/Trip/addTrip";
      const method = edit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${userProfile.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      });

      if (res.ok) {
        if (edit) {
          const updatedTrips = trips.map((tripItem) => {
            if (tripItem.id === trip.id) {
              return {
                ...tripItem,
                origin: tripData.origin,
                destination: tripData.destination,
                price: tripData.pricePerTon,
                departureDate: tripData.departureDate,
                arriveDate: tripData.arriveDate,
              };
            }
            return tripItem;
          });
          setTrips(updatedTrips);
        } else {
          const tripDataState = {...tripData, tripState: "Pendiente"};
          setTrips((prevTrips) => [...prevTrips, tripDataState]);
        }
      } else {
        throw new Error("Error en la solicitud: " + (await res.json()));
      }
    } catch (error) {
      setMessage(error.message);
      console.error("Error:", error);
      setFetchModal(true);
    } finally {
      setShowModal(false);
    }
  };

  const actions = [
    {
      label: "Editar",
      handler: editTrip,
      className: "bg-blue-500 hover:bg-blue-700",
    },
    {
      label: "Eliminar",
      handler: removeTrip,
      className: "bg-red-500 hover:bg-red-700",
    },
  ];

  const columns = [
    { key: "origin", value: "Origen" },
    { key: "destination", value: "Destino" },
    { key: "departureDate", value: "Fecha de salida" },
    { key: "arriveDate", value: "Fecha de llegada" },
    { key: "tripState", value: "Estado" },
  ];

  return (
    <>
      {showModal && (
        <ModalTrip
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          edit={edit}
          trip={trip}
        />
      )}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 mb-4">
        {/* Detalles del barco */}
        <div className="flex flex-wrap justify-around">
          <div>
            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Patente: {ship.shipPlate}
            </h5>
            <h6 className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
              Capitán: {ship.captain}
            </h6>
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-400">
                Tipo de barco:{" "}
                <span className="font-medium">{ship.typeShip}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Capacidad:{" "}
                <span className="font-medium">{ship.capacity} toneladas</span>
              </p>
            </div>
            <span
              className={`inline-block mb-4 py-1 px-3 text-sm font-medium rounded-full ${
                statusStyles[ship.status]
              }`}
            >
              {ship.status}
            </span>
          </div>
          <div className="flex flex-row justify-center flex-wrap">
            <Button
              actionClick={() => handleEdit(ship)}
              className="w-full py-2 px-4 mt-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Editar barco
            </Button>
            <Button
              actionClick={() => onDelete(ship)}
              className="w-full py-2 px-4 mt-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Borrar barco
            </Button>
            <Button
              actionClick={handleCreateTrip}
              className="w-full py-2 px-4 mt-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Agregar viaje
            </Button>
          </div>
        </div>

        {/* Botón del acordeón */}
        <div className="mt-4">
          <button
            onClick={() => toggleAccordion(ship.id)}
            className="flex items-center justify-between w-full p-3 font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <span>Ver viajes</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                openShipId === ship.id ? "rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Contenido del acordeón */}
          {openShipId === ship.id && (
            <div className=" mt-2 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
              {trips && trips.length > 0 ? (
                <ReusableTable
                  columns={columns}
                  data={trips}
                  actions={actions}
                  statusColumn="tripState"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400 p-2">
                  No hay viajes disponibles para este barco.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShipCard