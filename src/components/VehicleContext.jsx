import { createContext, useState, useEffect, useContext, act } from "react";
import { ServiceAPI, PartAPI, VehicleAPI } from "../Api";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";

export const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [activeVehicle, setActiveVehicle] = useState(() => {
        const saveVehicle = localStorage.getItem("activeVehicle");
        return saveVehicle ? JSON.parse(saveVehicle) : null;
    });
    const [vehicles, setVehicles] = useState([]);
    const [services, setServices] = useState([]);
    const [parts, setParts] = useState([]);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const vehicleResponse = await VehicleAPI.getAll();
            if (Array.isArray(vehicleResponse.data)) {
                setVehicles(vehicleResponse.data);
            };
        } catch (error) {
            console.error("Error fetching vehicles!", error);
            toast.error("Error fetching vehicles!");
        } finally {
            setLoading(false);
        }
    }

    const fetchVehicleData = async (vehicleId) => {
        if (!vehicleId) {
            setLoading(false)
            return;
        }
        try {
            setLoading(true);                
            const serviceResponse = await ServiceAPI.getById(vehicleId);
            const partResponse = await PartAPI.getById(vehicleId);
            if (Array.isArray(serviceResponse.data) && Array.isArray(partResponse.data)) {
                setServices(serviceResponse.data);
                setParts(partResponse.data);
            };
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Couldn't load the data.")
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (user) {
            fetchVehicles();
        }
    }, [user])

    useEffect(() => {
        if (user && activeVehicle && activeVehicle.id) {
            localStorage.setItem("activeVehicle", JSON.stringify(activeVehicle));
            fetchVehicleData(activeVehicle.id);
        } else {
            localStorage.removeItem("activeVehicle");
            setServices([]);
            setParts([]);
        }
    }, [activeVehicle, user])


    const contextValue = {
        activeVehicle,
        setActiveVehicle,
        vehicles,
        setVehicles,
        services,
        setServices,
        parts,
        setParts,
        loading,
        fetchVehicleData,
        fetchVehicles
    }

    return (
        <VehicleContext.Provider value={contextValue}>
            {children}
        </VehicleContext.Provider>
    )
}