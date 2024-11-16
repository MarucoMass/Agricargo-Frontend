import { useState } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import ReusableTable from "../../components/tables/ReusableTable";
import AdminLayout from "../../layout/AdminLayout";
import { useAuthContext } from "../../components/context/AuthProvider";
import useFetchData from "../../hooks/useFetchData/UseFetchData";
import ModalFetch from "../../components/modalFetch/modalFetch";
import ConfirmationModal from "../../components/confimationModal/ConfirmationModal";

const AdminCreateTrip = () => {

  const [tripToDelete, setTripToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userProfile } = useAuthContext();
  const {
      data: typeShip
    } = useFetchData("https://localhost:7183/Ship/getShips", userProfile.token);
  const {
      data: trips, setData: setTrips
    } = useFetchData(
      "https://localhost:7183/Trip/getCompanyTrips",
      userProfile.token
    );

  const [selectedShipId, setSelectedShipId] = useState(""); 
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [arriveDate, setArriveDate] = useState("");
  const [price, setPrice] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentTripId, setCurrentTripId] = useState(null);

  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const renderTypeShips = typeShip.map((ship) => (
    <option key={ship.id} value={ship.id}>
      {ship.typeShip} - {ship.shipPlate}
    </option>
  ));

  const handleDeleteClick = (trip) =>{
    setTripToDelete(trip);
    setIsModalOpen(true);
  }

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    const newTrip = {
      origin,
      destination,
      pricePerTon: parseFloat(price),
      departureDate,
      arriveDate,
      ...(editMode ? {} : { shipId: selectedShipId }),
    };

    if (!editMode) {
      try {
            const res = await fetch(`https://localhost:7183/Trip/addTrip`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${userProfile.token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newTrip),
            });

            if (res.ok) {
              setTrips([...trips, newTrip]);
              console.log("Viaje creado", newTrip);
            } else {
                throw new Error(
                  "Error en la solicitud: " + (await res.json())
                );    
            }
      } catch (error) {
        setMessage(error.message);
        setShowModal(true);
        console.error(error);
      } 
        } else {
    try {
      const res = await fetch(
        `https://localhost:7183/Trip/updateTrip/${currentTripId}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userProfile.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTrip),
        }
      );

      const updatedTrips = trips.map((trip) => {
        if (trip.id === currentTripId) {
          return {
            ...trip,
            origin: newTrip.origin,
            destination: newTrip.destination,
            pricePerTon: newTrip.pricePerTon,
            departureDate: newTrip.departureDate,
            arriveDate: newTrip.arriveDate,
          };
        }
        return trip;
      });

      if (res.ok) {
        setTrips(updatedTrips);
        console.log("Viaje actualizado");
      } else {
        throw new Error("Error en la solicitud: " + (await res.json()));
      }
    } catch (error) {
      setMessage(error.message);
      setShowModal(true);
      console.error(error);
    } 
    }
  

    resetForm();
  };

  const resetForm = () => {
    setOrigin("");
    setDestination("");
    setDepartureDate("");
    setArriveDate("");
    setSelectedShipId("");
    setPrice("");
    setCurrentTripId(null);
    setEditMode(false);
  };

  const removeTrip = async () => {
    if(!tripToDelete) return;

    if (!editMode) {
        try {
          const response = await fetch(
            `https://localhost:7183/Trip/deleteTrip/${tripToDelete.id}`,
            {
              method: "DELETE",
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${userProfile.token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Error en la solicitud: " + await response.json());
          }

          const filteredTrips = trips.filter((trips) => trips.id != item.id);
          setTrips(filteredTrips);
          setIsModalOpen(false);
          setTripToDelete(null);
        } catch (error) {
          setIsModalOpen(false);
          setTripToDelete(null);
          setMessage(error.message);
          setShowModal(true);
          console.error("Error:", error);
        }
    }
  };

  const editTrip = (item) => {
    setOrigin(item.origin);
    setDestination(item.destination);
    setDepartureDate(item.departureDate.split("T")[0]); 
    setArriveDate(item.arriveDate.split("T")[0]); 
    setSelectedShipId(item.shipId);
    setCurrentTripId(item.id);
    setPrice(item.pricePerTon);
    setEditMode(true);
  };

  const actions = [
    {
      label: "Editar",
      handler: editTrip,
      className: "bg-blue-500 hover:bg-blue-700",
    },
    {
      label: "Eliminar",
      handler: handleDeleteClick,
      className: "bg-red-500 hover:bg-red-700",
    },
    // {
    //   label: "Eliminar",
    //   handler: removeTrip,
    //   className: "bg-red-500 hover:bg-red-700",
    // },
  ];

  const columns = [
    { key: "origin", value: "Origen" },
    { key: "destination", value: "Destino" },
    { key: "departureDate", value: "Fecha de salida" },
    { key: "arriveDate", value: "Fecha de llegada" },
  ];

  return (
    <AdminLayout>
      {showModal && (
        <ModalFetch message={message} onClose={() => setShowModal(false)} />
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={removeTrip}
        message={"¿Estás seguro de que deseas eliminar este Viaje?"}
      />
      <section className="w-full px-8 md:px-20 flex flex-col gap-6 pt-10">
        <h1 className="text-black text-3xl font-semibold dark:text-white">
          Crear viaje
        </h1>

        <form className=" flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="max-w-sm mb-10">
            <label
              htmlFor="ships"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Seleccione un barco
            </label>
            <select
              disabled={editMode}
              value={selectedShipId}
              onChange={(e) => setSelectedShipId(e.target.value)}
              id="ships"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected disabled value="">
                Tipo de barco
              </option>
              {renderTypeShips}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-black dark:text-white">Datos del viaje</h2>

            <div className="w-full flex flex-col lg:flex-row gap-4">
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
              <Input
                value={arriveDate}
                type="date"
                setInputValue={setArriveDate}
              >
                Fecha de llegada
              </Input>
              <Input value={price} type="number" setInputValue={setPrice}>
                Precio por tonelada
              </Input>
              {editMode && (
                <Button
                  typeButton="button"
                  className={"w-fit px-5 rounded-lg"}
                  actionClick={resetForm}
                >
                  Fin de modo edición
                </Button>
              )}
            </div>
          </div>
          <Button typeButton="submit" className={"w-fit px-5 rounded-lg"}>
            {editMode ? "Guardar cambios" : "Agregar viaje"}
          </Button>
        </form>

        <ReusableTable columns={columns} data={trips} actions={actions} />
      </section>
    </AdminLayout>
  );
};

export default AdminCreateTrip;
