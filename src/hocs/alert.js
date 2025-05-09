import { useState, useContext, createContext } from 'react';

export const ALERT_SUCCESS = "success";
export const ALERT_INFO = "info";
export const ALERT_WARNING = "warning";
export const ALERT_ERROR = "error";

const AlertContext = createContext();
export const useAlerts = () => {
    return useContext(AlertContext);
}

export const AlertProvider = ({ children }) => {
    // alert definition: severity, message, id
    const [alerts, setAlerts] = useState([]);

    const addAlert = (severity, message) => {
        const id = Date.now();
        setAlerts((prevAlerts) => [...prevAlerts, { severity, message, id }]);
        setTimeout(() => {
            removeAlert(id);
        }, 3000); // Remove alert after 3 seconds
    }

    const removeAlert = (id) => {
        setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.id !== id));
    }

    return (
        <AlertContext.Provider value={{
            alerts,
            addAlert,
            removeAlert
        }}>
            {children}
        </AlertContext.Provider>
    );
}
