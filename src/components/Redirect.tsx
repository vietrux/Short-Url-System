import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect } from "react";
export default function Redirect() {
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    async function GetUrl() {
      const docRef = doc(db, "urls", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        window.location.href = docSnap.data().long;
      } else {
        navigate("/");
      }
    }
    GetUrl();
  }, [id, navigate]);
  return (
    <div className="absolute w-full h-full flex items-center justify-center ">
      <div>
        <h1 className="text-3xl font-semibold text-center">Chuyển hướng...</h1>
      </div>
    </div>
  );
}