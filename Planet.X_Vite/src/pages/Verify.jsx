import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Verify() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch(`${window.API_URL}/api/verify/${token}`);
        const data = await response.json();

        if (response.ok) {
          setMessage("Email verified. Redirecting to login...");

          // ⏱️ počkej 2 sekundy a přesměruj
          setTimeout(() => {
            navigate("/login");
          }, 2000);

        } else {
          setMessage(data.error);
        }

      } catch (err) {
        setMessage("Verification failed.");
      }
    };

    verifyUser();
  }, [token, navigate]);

  return (
    <div>
      <h2>{message}</h2>
    </div>
  );
}

export default Verify;



/*import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Verify() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch(`${window.API_URL}/api/verify/${token}`);
        const data = await response.json();

        if (response.ok) {
          setMessage("Email successfully verified.");
        } else {
          setMessage(data.error);
        }

      } catch (err) {
        setMessage("Verification failed.");
      }
    };

    verifyUser();
  }, [token]);

  return (
    <div>
      <h2>{message}</h2>
    </div>
  );
}

export default Verify;*/