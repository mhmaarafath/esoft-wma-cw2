import { View, Text } from 'react-native';
import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export default function GlobalProvider({children}) {
    const [visible, setVisible] = useState(false);
    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);

    return (
        <GlobalContext.Provider
            value={{
                visible,
                setVisible,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )


}
