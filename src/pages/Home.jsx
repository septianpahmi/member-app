import { useState } from "react";
import axios from "axios";

const MemberScan = () => {
  const [memberId, setMemberId] = useState("");
  const [memberInfo, setMemberInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!memberId) {
        setError("ID Member tidak boleh kosong.");
        return;
      }
      const res = await axios.post(
        "https://memberapp-alharamain.vercel.app/api/membership/check",
        {
          barcode: memberId.trim(),
        }
      );

      setMemberInfo(res.data);
      setError(null);
    } catch (err) {
      setMemberInfo(null);
      setError("Member tidak ditemukan atau server error." + err.message);
    }

    setMemberId("");
  };
  const handleAddPoint = async () => {
    try {
      await axios.put(
        `https://memberapp-alharamain.vercel.app/api/membership/add-point/${memberInfo.member_id}`
      );

      const res = await axios.post(
        "http://localhost:3000/api/membership/check",
        {
          barcode: memberInfo.member_id,
        }
      );

      setMemberInfo(res.data);
    } catch (err) {
      console.error("Gagal tambah point:", err);
    }
  };

  const handleResetPoint = async () => {
    try {
      await axios.put(
        `https://memberapp-alharamain.vercel.app/api/membership/reset-point/${memberInfo.member_id}`
      );

      const res = await axios.post(
        "http://localhost:3000/api/membership/check",
        {
          barcode: memberInfo.member_id,
        }
      );

      setMemberInfo(res.data);
    } catch (err) {
      console.error("Gagal reset point:", err);
    }
  };

  return (
    <div
      className="w-full fixed-top pt-5 px-3 mt-5"
      style={{ paddingTop: "100px", maxWidth: "600px", margin: "0 auto" }}
    >
      <h2>Scan / Input ID Member</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Scan atau ketik ID Member"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          autoFocus
          style={{
            padding: "10px",
            fontSize: "1rem",
            width: "300px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 15px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginLeft: "10px",
          }}
        >
          Cek Member
        </button>
      </form>

      {memberInfo && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            border: "1px solid #d4edda",
            backgroundColor: "#f0fff4",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
            color: "#155724",
          }}
        >
          <h3
            style={{
              marginBottom: "1rem",
              fontSize: "1.25rem",
              color: "#2c662d",
            }}
          >
            Data Member Ditemukan
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "2rem",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ margin: 0 }}>
                <strong>Nama:</strong>
              </p>
              <p style={{ margin: 0 }}>{memberInfo.name}</p>
            </div>
            <div>
              <p style={{ margin: 0 }}>
                <strong>Email:</strong>
              </p>
              <p style={{ margin: 0 }}>{memberInfo.email}</p>
            </div>
            <div>
              <p style={{ margin: 0 }}>
                <strong>Telepon:</strong>
              </p>
              <p style={{ margin: 0 }}>{memberInfo.phone}</p>
            </div>
          </div>
          <div>
            <p
              style={{ margin: 0, justifyContent: "center", marginTop: "2rem" }}
            >
              <strong>Poin:</strong>
            </p>
            <p style={{ fontWeight: "bold", fontSize: "3rem" }}>
              {memberInfo.point}
            </p>
          </div>
          <button
            onClick={handleAddPoint}
            style={{
              padding: "10px 15px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            Tambah Point
          </button>

          <button
            onClick={handleResetPoint}
            style={{
              padding: "10px 15px",
              backgroundColor: "orange",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            Reset Point
          </button>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "1rem", color: "red" }}>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};
export default MemberScan;
