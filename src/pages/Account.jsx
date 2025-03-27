import { useState, useEffect } from "react";
import { Modal, Button, Input, Select, Upload, Table } from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
const storage = getStorage();
const db = getFirestore();

const Account = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [donors, setDonors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    age: "",
    bloodGroup: "",
    contact: "",
    imageUrl: "https://via.placeholder.com/150",
    bloodDonation: true,
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchUserDonors();
  }, []);

  const fetchUserDonors = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn("No user is logged in");
        return;
      }

      const querySnapshot = await getDocs(collection(db, "donors"));
      const userDonors = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (donor) => donor.bloodDonation === true && donor.userId === user.uid
        );

      setDonors(userDonors);
    } catch (error) {
      console.error("Error fetching user donors: ", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = ({ file }) => {
    setFile(file);
  };

  const handleSubmit = async () => {
    let imageUrl = formData.imageUrl;
    if (file) {
      const storageRef = ref(storage, `profileImages/${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    try {
      if (isEditMode) {
        await updateDoc(doc(db, "donors", editingId), {
          ...formData,
          // imageUrl,
        });
      } else {
        await addDoc(collection(db, "donors"), {
          ...formData,
          imageUrl,
          userId: auth.currentUser?.uid || "guest",
        });
      }
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingId(null);
      fetchUserDonors();
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  const handleEdit = (donor) => {
    setFormData(donor);
    setEditingId(donor.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "donors", id));
      fetchDonors();
    } catch (error) {
      console.error("Error deleting donor: ", error);
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
    <div className="min-h-[90vh] p-5">
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        className="mb-4"
      >
        Become a Donor
      </Button>
      <Table dataSource={donors} columns={columns} rowKey="id" />

      <Modal
        title={isEditMode ? "Edit Donor" : "Blood Donation Form"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Input
          placeholder="Age"
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
          className="mb-2"
        />
        <Select
          placeholder="Select Blood Group"
          className="w-full mb-2"
          onChange={(value) => setFormData({ ...formData, bloodGroup: value })}
          required
        >
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((group) => (
            <Option key={group} value={group}>
              {group}
            </Option>
          ))}
        </Select>
        <Input
          placeholder="Contact Number"
          type="tel"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          required
          className="mb-2"
        />
        <Upload beforeUpload={() => false} onChange={handleUpload} maxCount={1}>
          <Button icon={<UploadOutlined />}>Upload Image (Optional)</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default Account;
