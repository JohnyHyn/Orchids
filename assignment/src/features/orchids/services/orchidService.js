import { create } from "axios";
import axiosClient from "../../../api/axiosClient";
const orchidService = {
    getAll: () => {
        return axiosClient.get('/orchids');
    },
    getById: (id) => {
        return axiosClient.get(`/orchids/${id}`)
    },
    create: (data) => {
        return axiosClient.post('/orchids', data);
    },
    update: (id, data) => {
        return axiosClient.put(`/orchids/${id}`, data)
    },
    delete: (id) => {
        return axiosClient.delete(`/orchids/${id}`)
    },
}
export default orchidService;