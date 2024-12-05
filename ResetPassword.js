import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const location = useLocation();

    // Cuando el componente se monta, extraemos el token de la URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword && token) {
            try {
                const response = await fetch('http://localhost:3000/api/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token, newPassword }),
                });
                const data = await response.json();
                if (data.success) {
                    alert('Contraseña restablecida correctamente');
                } else {
                    setError(data.message || 'Error al restablecer la contraseña');
                }
            } catch (err) {
                setError('Hubo un error al procesar tu solicitud');
            }
        }
    };

    return (
        <div>
            <h2>Restablecer Contraseña</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Nueva Contraseña:
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </label>
                <button type="submit">Restablecer Contraseña</button>
            </form>
        </div>
    );
};

export default ResetPassword;
