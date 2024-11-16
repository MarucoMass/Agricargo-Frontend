import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import SortSection from "../../components/sortSection/SortSection";
import { useAuthContext } from "../../components/context/AuthProvider";
import Button from "../../components/button/Button";
import useFetchData from "../../hooks/useFetchData/UseFetchData";
import ModalFetch from "../../components/modalFetch/modalFetch";
import ShipCard from "../../components/shipCard/ShipCard";

const AdminShips = () => {
  const { userProfile } = useAuthContext();
  const { data: initialShips } = useFetchData(
    "https://localhost:7183/Ship/getShips",
    userProfile.token
  );

  const [filteredShips, setFilteredShips] = useState(initialShips || []);
  const [filterActivate, setFilterActivate] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

  const statusOrder = ["Disponible", "Ocupado"];

  useEffect(() => {
    setFilteredShips(initialShips);
  }, [initialShips]);

  const sortShipsByStatus = () => {
    const sorted = [...filteredShips].sort((a, b) => {
      const statusA = statusOrder.indexOf(a.status);
      const statusB = statusOrder.indexOf(b.status);
      return isAscending ? statusA - statusB : statusB - statusA;
    });
    setFilteredShips(sorted);
    setIsAscending(!isAscending);
    setFilterActivate(true);
  };

  const sortByCapacity = () => {
    const sorted = [...filteredShips].sort((a, b) => {
      return isAscending ? a.capacity - b.capacity : b.capacity - a.capacity;
    })
    setFilteredShips(sorted);
    setIsAscending(!isAscending);
    setFilterActivate(true);
  }
  const sortByShipPlate = () => {
    const sorted = [...filteredShips].sort((a, b) => {
      if (isAscending) {
        return a.shipPlate.localeCompare(b.shipPlate); 
      } else {
        return b.shipPlate.localeCompare(a.shipPlate); 
      }
    })
    setFilteredShips(sorted);
    setIsAscending(!isAscending);
    setFilterActivate(true);
  }

  const resetFilters = () => {
    setFilteredShips(initialShips);
    setFilterActivate(false);
  };

  const removeShip = async (item) => {
    try { 
      const response = await fetch(
        `https://localhost:7183/Ship/deleteShip/${item.id}`,
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

      // Actualiza filteredShips después de eliminar un barco
      setFilteredShips((prevShips) =>
      prevShips.filter((ship) => ship.id !== item.id)
      );
    } catch (error) {
        setMessage(error.message);
        setShowModal(true);
        console.error("Error:", error.message);
    }
  };


  const handleCreateShip = () => {
    navigate("/empresa/crear-barco");
  };


const ships = filteredShips.map((ship) => (
  <ShipCard
    key={ship.id}
    ship={ship}
    onDelete={removeShip}
    setMessage={setMessage} 
    setFetchModal={setShowModal}
  />
));

  const sortOptions = [
    { label: "Estado", actionSort: sortShipsByStatus },
    { label: "Capacidad", actionSort: sortByCapacity },
    { label: "Patente", actionSort: sortByShipPlate }
  ];

  return (
    <AdminLayout>
      {showModal && (
        <ModalFetch message={message} onClose={() => setShowModal(false)} />
      )}
      <SortSection
        title={"Barcos:"}
        sortOptions={sortOptions}
        filterActivate={filterActivate}
        resetFilters={resetFilters}
      >
        <Button
          className={"w-fit px-5 rounded-lg"}
          actionClick={handleCreateShip}
        >
          Crear barco
        </Button>
      </SortSection>
      <div className="px-8 md:px-20 w-full py-6">
        {ships}
      </div>
    </AdminLayout>
  );
};

export default AdminShips;
