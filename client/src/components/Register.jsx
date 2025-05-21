import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useRegisterMutation } from '../features/auth/authApiSlice';

const Register = () => {
    const [registerFunc] = useRegisterMutation();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        phone: '',
    });

    const toast = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...formData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        registerFunc(formData)

        // בדיקה בסיסית - אפשר להרחיב
        if (!formData.username || !formData.email || !formData.password) {
            toast.current.show({ severity: 'warn', summary: 'שגיאה', detail: 'אנא מלא את כל השדות', life: 3000 });
            return;
        }

        // כאן תוכל לקרוא ל-API להרשמה
        console.log('Register data:', formData);

        toast.current.show({ severity: 'success', summary: 'הצלחה', detail: 'משתמש נוצר בהצלחה', life: 3000 });
    };

    return (
        <div className="register-form" style={{ maxWidth: '400px', margin: 'auto' }}>
            <Toast ref={toast} />
            <h2>הרשמה</h2>
            <form onSubmit={handleSubmit}>

                <label htmlFor="username" className="p-d-block p-mb-2">שם משתמש</label>
                <InputText
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="p-d-block p-mb-3"
                    required
                    placeholder="הכנס שם משתמש"
                />

                <label htmlFor="email" className="p-d-block p-mb-2">אימייל</label>
                <InputText
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="p-d-block p-mb-3"
                    required
                    placeholder="הכנס אימייל"
                />

                <label htmlFor="password" className="p-d-block p-mb-2">סיסמה</label>
                <Password
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    feedback={false}
                    toggleMask
                    required
                    placeholder="הכנס סיסמה"
                    className="p-d-block p-mb-4"
                />

                <Button type="submit" label="הרשם" className="p-button-primary" />
            </form>
        </div>
    );
};

export default Register;
