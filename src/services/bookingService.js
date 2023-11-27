import api from "./api";

const formatDate = (d) => {
    const padWithZero = (number) => String(number).padStart(2, '0');
    const year = d.getFullYear();
    const month = padWithZero(d.getMonth() + 1);
    const day = padWithZero(d.getDate());
    return `${year}-${month}-${day}T00:00:00`;
};

export function fetchRoomData(dateResponse, setRoomDataArray, setAuthFromOpen, handleFetchError) {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: 'Bearer ' + token,
        };

        const currentDate = dateResponse;
        const nextDate = new Date(currentDate.getTime() + 1000 * 60 * 60 * 24);

        const startTime = formatDate(currentDate);
        const endTime = formatDate(nextDate);

        api.get( `/api/bookings?startTime=${startTime}&endTime=${endTime}`, {headers}).then(
            (response)=>{
                console.log('get response');
                setRoomDataArray(response.data);
                setAuthFromOpen(false);
            }
        );
    } catch (error) {
        handleFetchError(error);
    }
}