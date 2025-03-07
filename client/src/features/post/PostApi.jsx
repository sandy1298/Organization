import { axiosi } from "../../config/axios.js";


//Uploads an image to Cloudinary and returns the image URL
export const uploadImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "sandeep-insta");

    try {
        const res = await axiosi.post(
            "https://api.cloudinary.com/v1_1/sandeep1298/image/upload",
            data,
            {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: false,
            }
        );
        return res.data.url;
    } catch (error) {
        throw new Error(error.response?.data?.error?.message || "Failed to upload image");
    }
};


// Creates a new employee entry in the database.
//   If an image is provided, it first uploads the image and then saves the employee details.
export const createEmployee = async (employeeDetails) => {
    try {
        if (employeeDetails.image) {
            const imageUrl = await uploadImage(employeeDetails.image);
            employeeDetails.image = imageUrl;
        }
        const res = await axiosi.post("api/employees", employeeDetails, {
            headers: { "Content-Type": "application/json" },
        });
        return res.data;
       } catch (error) {
        throw error.response?.data?.error || "Failed to create employee";
      }
   };

//Fetches the list of employees from the server.
export const getEmployees = async () => {
    try {
        const res = await axiosi.get("api/employees");
        return res.data.posts;
    } catch (error) {
        throw error.response?.data?.error || "Failed to fetch employees";
    }
};



