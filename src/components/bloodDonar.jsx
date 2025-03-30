/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Upload, Table } from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth } from "../firebaseConfig/firebase";

const db = getFirestore();

const BloodDonor = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [donors, setDonors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      age: "",
      bloodGroup: "",
      contact: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    fetchUserDonors();
  }, []);

  const fetchUserDonors = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const querySnapshot = await getDocs(collection(db, "donors"));
      const userDonors = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((donor) => donor.userId === user.uid);
      setDonors(userDonors);
    } catch (error) {
      console.error("Error fetching donors:", error);
    }
  };

  const handleFileChange = (info) => {
    if (info.file && info.file.originFileObj) {
      setFile(info.file.originFileObj);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "organDonation");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
        { method: "POST", body: formData }
      );
      if (!response.ok) throw new Error("Cloudinary upload failed");
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  const resetForm = () => {
    reset();
    setFile(null);
    setIsEditMode(false);
    setEditingId(null);
  };

  const onSubmit = async (data) => {
    let imageUrl = data.imageUrl;
    if (file) {
      const uploadedUrl = await uploadToCloudinary(file);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    try {
      if (isEditMode) {
        await updateDoc(doc(db, "donors", editingId), { ...data, imageUrl });
      } else {
        await addDoc(collection(db, "donors"), {
          ...data,
          imageUrl,
          bloodDonation: true,
          userId: auth.currentUser?.uid || "guest",
        });
      }

      setIsModalOpen(false);
      resetForm();
      fetchUserDonors();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleEdit = (donor) => {
    reset(donor);
    setEditingId(donor.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "donors", id));
      fetchUserDonors();
    } catch (error) {
      console.error("Error deleting donor:", error);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      render: (img) => (
        <img src={img} alt="Donor" className="w-12 h-12 rounded-full" />
      ),
    },
    { title: "Name", dataIndex: "name" },
    { title: "Age", dataIndex: "age" },
    { title: "Blood Group", dataIndex: "bloodGroup" },
    { title: "Contact", dataIndex: "contact" },
    {
      title: "Actions",
      render: (donor) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(donor)}
            className="mr-2"
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(donor.id)}
          />
        </>
      ),
    },
  ];

  return (
    <div className="p-5">
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        className="mb-4"
      >
        Become a Donor
      </Button>
      <Table
        dataSource={donors}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={isEditMode ? "Edit Donor" : "Blood Donation Form"}
        open={isModalOpen}
        onOk={handleSubmit(onSubmit)}
        onCancel={() => {
          resetForm();
          setIsModalOpen(false);
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("name", { required: "Full Name is required" })}
            placeholder="Full Name"
            className="w-full border p-2 mb-2"
          />
          <p className="text-red-500">{errors.name?.message}</p>

          <input
            {...register("age", { required: "Age is required" })}
            type="number"
            placeholder="Age"
            className="w-full border p-2 mb-2"
          />
          <p className="text-red-500">{errors.age?.message}</p>

          <select
            {...register("bloodGroup", { required: "Blood Group is required" })}
            className="w-full border p-2 mb-2"
          >
            <option value="">Select Blood Group</option>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          <p className="text-red-500">{errors.bloodGroup?.message}</p>

          <Upload
            beforeUpload={() => false}
            onChange={handleFileChange}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload Image (Optional)</Button>
          </Upload>
        </form>
      </Modal>
    </div>
  );
};

export default BloodDonor;
