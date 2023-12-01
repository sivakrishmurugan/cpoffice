import { useEffect, useState } from "react";

const useClient = () => {
    const [isClient, setClient] = useState(false);

    useEffect(() => {
        setClient(true);
    }, [])

    return isClient;
}

export default useClient;