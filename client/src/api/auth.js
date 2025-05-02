import axios from "axios";

export const createOrUpdateUser = async (authtoken) => {
    return await axios.post(
        `${process.env.REACT_APP_API_URL}/create-or-update-user`,
        {},
        {
            headers: {
                authtoken,
            },
        }
    );
};

export const currentUser = async (authtoken) => {
    return await axios.post(
        `${process.env.REACT_APP_API_URL}/current-user`,
        {},
        {
            headers: {
                authtoken,
            },
        }
    );
};

export const currentAdmin = async (authtoken) => {
    return await axios.post(
        `${process.env.REACT_APP_API_URL}/current-admin`,
        {},
        {
            headers: {
                authtoken,
            },
        }
    );
};