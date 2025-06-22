//manage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Table, Form, Container } from "react-bootstrap";

const MemberPage = () => {
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    member_id: "",
    name: "",
    email: "",
    phone: "",
    point: "",
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fetchMembers = async () => {
    try {
      await axios.get("https://memberapp-alharamain.vercel.app/membership/list");
      setMembers(res.data);
    } catch (err) {
      console.error("Gagal fetch member:", err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleShowModal = (member = null) => {
    if (member) {
      setFormData(member);
      setEditingMember(member);
    } else {
      setFormData({
        member_id: "",
        name: "",
        email: "",
        phone: "",
        point: "",
      });
      setEditingMember(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMember(null);
    setFormData({ member_id: "", name: "", email: "", phone: "", point: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await axios.put(
          `https://memberapp-alharamain.vercel.app/membership/update/${formData.member_id}`,
          formData
        );
      } else {
        try {
          await axios.post("https://memberapp-alharamain.vercel.app/membership/add", {
            ...formData,
            point: Number(formData.point) || 0,
          });
          fetchMembers();
          handleCloseModal();
        } catch (error) {
          if (error.response?.status === 400) {
            setErrorMessage("ID Member sudah digunakan.");
            setShowErrorModal(true);
          } else {
            setErrorMessage("Terjadi kesalahan saat menambahkan member.");
            setShowErrorModal(true);
          }
        }
      }
      fetchMembers();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving member:", error);
    }
  };

  const handleDelete = async (id) => {
    setMemberToDelete(id);
    setShowConfirmModal(true);
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `https://memberapp-alharamain.vercel.app/membership/delete/${memberToDelete}`
      );
      setShowConfirmModal(false);
      setMemberToDelete(null);
      fetchMembers();
    } catch (error) {
      console.error("Gagal menghapus:", error);
    }
  };
  return (
    <div className="w-full fixed-top pt-5 px-3 mt-5">
      <Container fluid className="w-full">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Manajemen Member</h2>
          <Button variant="primary" onClick={() => handleShowModal()}>
            Tambah Member
          </Button>
        </div>
        <Table striped bordered hover responsive className="w-100">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Nomor HP</th>
              <th>Point</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.member_id}>
                <td>{member.member_id}</td>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>{member.point}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleShowModal(member)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(member.member_id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingMember ? "Edit Member" : "Tambah Member"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>ID Member</Form.Label>
              <Form.Control
                type="text"
                name="member_id"
                value={formData.member_id}
                onChange={handleChange}
                required
                disabled={!!editingMember}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Lengkap</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nomor HP</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Batal
            </Button>
            <Button variant="success" type="submit">
              {editingMember ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Penghapusan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus member ini? Tindakan ini tidak bisa
          dibatalkan.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Batal
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Gagal Menyimpan</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MemberPage;
