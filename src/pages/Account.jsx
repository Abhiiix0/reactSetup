/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button, Select, Upload, Table } from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import BloodDonor from "../components/bloodDonar";
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

const { Option } = Select;
const db = getFirestore();

const OrganDonor = () => {
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
      organs: [],
      contact: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    fetchUserOrganDonors();
  }, []);

  const fetchUserOrganDonors = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const querySnapshot = await getDocs(collection(db, "OrganDonors"));
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
        `https://api.cloudinary.com/v1_1/docbwwhpj/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cloudinary upload failed: ${errorText}`);
      }

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
        await updateDoc(doc(db, "OrganDonors", editingId), {
          ...data,
          imageUrl,
        });
      } else {
        await addDoc(collection(db, "OrganDonors"), {
          ...data,
          imageUrl,
          userId: auth.currentUser?.uid || "guest",
        });
      }

      setIsModalOpen(false);
      resetForm();
      fetchUserOrganDonors();
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
      await deleteDoc(doc(db, "OrganDonors", id));
      fetchUserOrganDonors();
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
    {
      title: "Organs",
      dataIndex: "organs",
      render: (organs) => (Array.isArray(organs) ? organs.join(", ") : "N/A"),
    },
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
    <div>
      <BloodDonor />

      <div className="p-5">
        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
          className="mb-4"
        >
          Become an Organ Donor
        </Button>
        <Table
          dataSource={donors}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
        <Modal
          title={isEditMode ? "Edit Donor" : "Organ Donation Form"}
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
            <input
              {...register("age", { required: "Age is required" })}
              type="number"
              placeholder="Age"
              className="w-full border p-2 mb-2"
            />
            <Select
              mode="multiple"
              placeholder="Select Organs"
              className="w-full border p-2 mb-2"
              onChange={(value) => setValue("organs", value)} // Manually updating organs
              options={[
                { label: "Kidney", value: "Kidney" },
                { label: "Liver", value: "Liver" },
                { label: "Heart", value: "Heart" },
                { label: "Lungs", value: "Lungs" },
                { label: "Pancreas", value: "Pancreas" },
                { label: "Cornea", value: "Cornea" },
                { label: "Skin", value: "Skin" },
                { label: "Bone", value: "Bone" },
                { label: "Intestine", value: "Intestine" },
              ]}
            />

            <input
              {...register("contact", { required: "Contact is required" })}
              type="tel"
              placeholder="Contact Number"
              className="w-full border p-2 mb-2"
            />
            <Upload
              beforeUpload={() => false}
              onChange={handleFileChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default OrganDonor;
