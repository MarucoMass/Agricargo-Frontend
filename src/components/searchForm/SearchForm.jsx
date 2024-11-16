import Input from "../input/Input";
import Button from "../button/Button";
import { IoSearch } from "react-icons/io5";
import { useRef, useState } from "react";

const SearchForm = ({ isSearchMode = true, searchSetter }) => {
  const [errorSearch, setErrorSearch] = useState("");
  const [inputValues, setInputValues] = useState({
    origin: "",
    destination: "",
    quantity: "",
  });
  const [errors, setErrors] = useState({
    origin: false,
    destination: false,
    quantity: false,
  });

  // Refs for input fields
  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const quantityRef = useRef(null);

  // Validate individual fields
  const validateField = (field, value) => {
    let error = false;

    if (field === "origin" || field === "destination") {
      error = /\d/.test(value); // Error if there are numbers
    } else if (field === "quantity") {
      error = value <= 0 || isNaN(value); // Error if not positive or not numeric
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handleInputChange = (field, value) => {
    setInputValues((prevValues) => ({ ...prevValues, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all fields are empty
    if (!inputValues.origin && !inputValues.destination && !inputValues.quantity) {
      setErrorSearch("Debe ingresar los parámetros de búsqueda");
      return;
    }

    // Verify no field has an error
    const hasErrors = Object.values(errors).some((error) => error);

    if (!hasErrors) {
      searchSetter(inputValues);
      setErrorSearch(""); // Clear previous errors
    }
  };

  const buttonText = isSearchMode ? (
    "Buscar"
  ) : (
    <IoSearch className="text-white text-2xl mr-0.5 mt-0.5" />
  );
  const buttonClasses = isSearchMode
    ? "px-5 py-2.5 rounded-lg"
    : "rounded-full size-12 flex justify-center items-center";

  return (
    <>
      <form className="flex items-center gap-4 md:flex-row flex-col" onSubmit={handleSubmit}>
        <Input
          ref={originRef}
          setInputValue={(value) => handleInputChange("origin", value)}
          inputstyle={errors.origin || errorSearch ? "border-red-500" : ""}
        >
          Origen
        </Input>
        <Input
          ref={destinationRef}
          setInputValue={(value) => handleInputChange("destination", value)}
          inputstyle={errors.destination || errorSearch ? "border-red-500" : ""}
        >
          Destino
        </Input>
        <Input
          ref={quantityRef}
          type="number"
          setInputValue={(value) => handleInputChange("quantity", value)}
          inputstyle={errors.quantity || errorSearch ? "border-red-500" : ""}
        >
          Cantidad
        </Input>
        <Button className={buttonClasses} actionClick={handleSubmit}>
          {buttonText}
        </Button>
      </form>
      {errorSearch && <p className="text-red-500">{errorSearch}</p>}
    </>
  );
};

export default SearchForm;
