import Input from "../input/Input";
import Button from "../button/Button";
import { IoSearch } from "react-icons/io5";
import { useState } from "react";
// import { useDataContext } from "../context/DataProvider";
// import { fetchData } from "../../utils/fetchData";
// import { useNavigate } from "react-router-dom";

const SearchForm = ({ isSearchMode = true, searchSetter }) => {
  // const { inputValues, setInputValues, setResults } = useDataContext();
  // const navigate = useNavigate();
  const [inputValues, setInputValues] = useState({
    origin: "",
    destination: "",
    quantity: "",
  });

  const buttonText = isSearchMode ? (
    "Buscar"
  ) : (
    <IoSearch className="text-white text-2xl mr-0.5 mt-0.5" />
  );
  const buttonClasses = isSearchMode
    ? "px-5 py-2.5 rounded-lg"
    : "rounded-full size-12 flex justify-center item-center";

  const handleSubmit = (e) => {
    e.preventDefault();

    searchSetter(inputValues);


    // fetchData("/trips.json")
    //   .then((result) => {
    //     const filteredResult = result.filter(
    //       (result) =>
    //         result.origin === inputValues.origin &&
    //         result.destination === inputValues.destination &&
    //         result.quantity === inputValues.quantity
    //     );
    //     setResults(filteredResult);
    //     console.log(filteredResult);
    //     navigate("/cliente/resultados");
    //   })
    //   .catch((error) => console.log(error));
  };

  return (
    <form className="flex items-center gap-4">
      <Input
        setInputValue={(value) =>
          setInputValues({ ...inputValues, origin: value })
        }
      >
        Origen
      </Input>
      <Input
        setInputValue={(value) =>
          setInputValues({ ...inputValues, destination: value })
        }
      >
        Destino
      </Input>
      <Input
        type="number"
        setInputValue={(value) =>
          setInputValues({ ...inputValues, quantity: value })
        }
      >
        Cantidad
      </Input>
      <Button className={buttonClasses} actionClick={handleSubmit}>
        {buttonText}
      </Button>
    </form>
  );
};

export default SearchForm;
