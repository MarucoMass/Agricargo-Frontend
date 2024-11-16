import { useEffect, useState } from "react";
import { useAuthContext } from "../../components/context/AuthProvider";
import ReusableTable from "../../components/tables/ReusableTable";
import SuperAdminLayout from "../../layout/SuperAdminLayout";
import Button from "../../components/button/Button";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/confimationModal/ConfirmationModal"

const SuperAdminList = () => {
  const { userProfile } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null); // Estado para usuario a eliminar
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://localhost:7183/api/User/GetUsers", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${userProfile.token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const removeUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(
        `https://localhost:7183/api/User/DeleteUser?idUser=${userToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userProfile.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.statusText);
      }

      const usersFiltered = users.filter((user) => user.id !== userToDelete.id);
      setUsers(usersFiltered);
      setIsModalOpen(false); // Cierra el modal después de eliminar
    } catch (error) {
      setIsModalOpen(false);
      console.error("Error:", error);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsModalOpen(true); // Abre el modal
  };

  const columns = [
    { key: "name", value: "Nombre" },
    { key: "typeUser", value: "Tipo de user" },
  ];

  const actions = [
    {
      label: "Eliminar",
      handler: handleDeleteClick,
      className: "bg-red-500 hover:bg-red-700",
    },
  ];

  return (
    <SuperAdminLayout>
      <div className="flex justify-end mb-4 w-full p-3">
        <Button
          className="text-white px-6 py-2 rounded-md bg-green-600 hover:bg-green-400 border-2 border-green-700 hover:border-green-500 shadow-md hover:shadow-lg"
          actionClick={() => navigate("/sysadmin/createUser")}
        >
          Crear Usuario
        </Button>
      </div>
      <ReusableTable columns={columns} data={users} actions={actions} />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Cierra el modal sin eliminar
        onConfirm={removeUser} // Confirma y elimina el usuario
        message={"¿Estás seguro de que deseas eliminar este Usuario?"}
      />
    </SuperAdminLayout>
  );
};

export default SuperAdminList;
