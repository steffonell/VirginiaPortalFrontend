import axiosInstance from '../components/apiService';

const changePassword = async(oldPassword, newPassword, userName) => {
    try {
        const requestData = {
            oldPassword,
            newPassword,
            userName
        };
        const response = await axiosInstance.put('korisnik/promeniSifru', requestData);
        console.log(response);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            if (error.response.status === 404) {
                alert('Korisnik nije pronađen');
            } else if (error.response.status === 412) {
                alert('Stara lozinka se ne poklapa');
            } else {
                alert('Došlo je do greške prilikom promene lozinke');
            }
        } else if (error.request) {
            console.log(error.request);
            alert('Nema odgovora od servera');
        } else {
            console.log('Error', error.message);
            alert('Došlo je do greške prilikom postavljanja zahteva');
        }
        return null;
    }
};

const UserService = {
    changePassword,
};

export default UserService;
