import { useState } from 'react'
import { BsArrowDown } from "react-icons/bs";
import Button from '../button/Button';
import { useAuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import IsLoggedHook from '../../hooks/isLoggedHook/IsLoggedHook';
import useFetchData from "../../hooks/useFetchData/UseFetchData";
import ModalFetch from '../modalFetch/modalFetch';


const TripCard = ({
  id,
  pricePerTon,
  capacity,
  departureDate,
  origin,
  destination,
  arriveDate,
  ship,
  favId
}) => {
  const { isLogged, setIsLogged } = IsLoggedHook();
  const { userProfile } = useAuthContext();
  const [showModal, setShowModal] = useState(false)

  const [favoriteId, setFavoriteId] = useState(favId);

  const [isLiked, setIsLiked] = useState(favId);

  const navigate = useNavigate();

  const handleLikeClick = () => {
    if(isLogged){
      setIsLiked(!isLiked);
      if (!isLiked) {
        addFavorite();
      } else {
        deleteFavorite();
      }
    }else{
      setShowModal(true)
    }

  };

  const addFavorite= async () => {
    try {
      const response = await fetch(
        "https://localhost:7183/api/Favorite/addFavorite",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${userProfile.token}`,
          },
          body: id
        }
      );
      
      if (!response.ok) {
        throw new Error(
          `Error en la solicitud de agregado: ${response.statusText}`
        );
      }
      const result = await response.json();
      setFavoriteId(result)
      
    } catch (err) {
      console.log(err);
    }
    
  };
  
  const deleteFavorite = async () => {
    try {
      const response = await fetch(
        `https://localhost:7183/api/Favorite/deleteFavorite/${favoriteId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${userProfile.token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(
          `Error en la solicitud de borrado: ${response.statusText}`
        );
      }

    } catch (err) {
      console.log(err);
    }
  };

  const handleNavigate = () => {
    navigate(`/resultado/${id}`, {
      state: {
        trip: {
          id,
          pricePerTon,
          capacity,
          departureDate,
          origin,
          destination,
          arriveDate,
          ship
        },
      },
    });
  };

  return (
    <>
    
    {showModal && (
      <ModalFetch message={"Debe iniciar sesion"} onClose={() => setShowModal(false)} />
    )}
    <div className="flex justify-between items-center flex-col lg:flex-row gap-2 border border-gray-200 rounded-lg p-6 bg-white shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between flex-grow space-x-8 dark:text-white flex-col sm:flex-row">
        {/* Origin and destination */}
        <div className="flex flex-col  items-center whitespace-nowrap">
          <p className="text-gray-900 font-bold dark:text-white">{origin}</p>
          <span className="text-gray-400 flex justify-center text-3xl py-2">
            <BsArrowDown />
          </span>
          <p className="text-gray-900 font-bold dark:text-white">
            {destination}
          </p>
        </div>

        {/* Bussines Details */}
        <div className="flex flex-col justify-around sm:items-center items-start w-full p-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {capacity} toneladas
          </h3>
          <p className="text-ls text-gray-400">
            Tiempo de entrega:{" "}
            <span>
              {Math.ceil(
                (new Date(arriveDate) - new Date(departureDate)) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              dias
            </span>
          </p>
          <p className="text-ls text-gray-400">
            Siguiente salida: {departureDate}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center">
        <section>
          <div className="text-center pb-3 pl-6">
            <h2 className="text-2xl font-bold text-gray-500 dark:text-white">
              ${pricePerTon}
            </h2>
          </div>
          <section className="flex items-center gap-x-2">
            <button
              type="button"
              onClick={handleLikeClick}
              className={`rounded-full text-sm p-2 text-center inline-flex items-center ${
                isLiked ? "text-white" : "text-black dark:text-white"
              }`}
            >
              <svg
                fill={isLiked ? "red" : "white"} // Cambia el color de relleno cuando se hace clic
                height="30px"
                width="30px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="-51.21 -51.21 614.55 614.55"
                xmlSpace="preserve"
                stroke={isLiked ? "red" : "currentColor"}
                className={`${
                  isLiked ? "stroke-red-500" : "stroke-black dark:stroke-white"
                } transition-colors duration-300`}
                strokeWidth="10"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke={isLiked ? "red" : "black"}
                  strokeWidth="30.72786"
                >
                  <g>
                    <g>
                      <path d="M511.489,167.372c-7.573-84.992-68.16-146.667-144.107-146.667c-44.395,0-85.483,20.928-112.427,55.488 c-26.475-34.923-66.155-55.488-110.037-55.488c-75.691,0-136.171,61.312-144.043,145.856c-0.811,5.483-2.795,25.045,4.395,55.68 C15.98,267.532,40.62,308.663,76.759,341.41l164.608,144.704c4.011,3.541,9.067,5.312,14.08,5.312 c4.992,0,10.005-1.749,14.016-5.248L436.865,340.13c24.704-25.771,58.859-66.048,70.251-118.251 C514.391,188.514,511.66,168.268,511.489,167.372z"></path>
                    </g>
                  </g>
                </g>
              </svg>
            </button>
            {/* <button className="bg-blue-500 text-white py-1.5 px-4 rounded-lg ml-0.5">Ver más</button> */}
            <Button className={"p-2 rounded-lg"} actionClick={handleNavigate}>
              Ver más
            </Button>
          </section>
        </section>
      </div>
    </div>
    </>
  );
};

export default TripCard