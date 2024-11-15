import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import ReusableTable from "../../components/tables/ReusableTable";
import SortSection from "../../components/sortSection/SortSection";
import { useAuthContext } from "../../components/context/AuthProvider";
import Button from "../../components/button/Button";
import useFetchData from "../../hooks/useFetchData/UseFetchData";
import ModalFetch from "../../components/modalFetch/modalFetch";
import ConfirmationModal from "../../components/confimationModal/ConfirmationModal";

const AdminListShips = () => {
  const { userProfile } = useAuthContext();
  const { data: initialShips } = useFetchData(
    "https://localhost:7183/Ship/getShips",
    userProfile.token
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shipToDelete, setShipToDelete] = useState(null);

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

  const handleDeleteClick = (ship) =>{
    setIsModalOpen(true);
    setShipToDelete(ship);
  }

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
      setIsModalOpen(false);
      setShipToDelete(null);
    } catch (error) {
        setIsModalOpen(false);
        setShipToDelete(null);
        setMessage(error.message);
        setShowModal(true);
        console.error("Error:", error.message);
    }

    console.log(item.id)
  };

  const editShip = (item) => {
    navigate(`/empresa/modificar-barco/${item.id}`, {
      state: {
        ship: {
          capacity: item.capacity,
          typeShip: item.typeShip,
          captain: item.captain,
          shipPlate: item.shipPlate,
          idShip: item.id,
        },
      },
    });
  };

  const handleCreateShip = () => {
    navigate("/empresa/crear-barco");
  };

  const actions = [
    {
      label: "Editar",
      handler: editShip,
      className: "bg-blue-500 hover:bg-blue-700",
    },
    {
      label: "Eliminar",
      handler: handleDeleteClick,
      className: "bg-red-500 hover:bg-red-700",
    },
    // {
    //   label: "Eliminar",
    //   handler: removeShip,
    //   className: "bg-red-500 hover:bg-red-700",
    // },
  ];

  const columns = [
    { key: "shipPlate", value: "Barco" },
    { key: "typeShip", value: "Tipo" },
    { key: "capacity", value: "Toneladas Maximas" },
    { key: "status", value: "Estado" },
  ];

  const sortOptions = [{ label: "Estado", actionSort: sortShipsByStatus }];

  return (
    <AdminLayout>
      {showModal && (
        <ModalFetch message={message} onClose={() => setShowModal(false)} />
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={removeShip}
      />
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
        <ReusableTable
          columns={columns}
          data={filteredShips}
          actions={actions}
          statusColumn={"status"}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminListShips;
