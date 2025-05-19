import React from 'react';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export default function Login() {
    return (
        <div className="card">
            <div className="flex flex-column md:flex-row justify-content-center align-items-center gap-5">
                
                <div className="flex flex-column align-items-center justify-content-center gap-3">
                    <div className="flex flex-column gap-2">
                        <label htmlFor="username">Username</label>
                        <InputText id="username" type="text" className="w-20rem" />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="password">Password</label>
                        <InputText id="password" type="password" className="w-20rem" />
                    </div>
                    <Button label="Login" icon="pi pi-user" className="w-20rem" />
                </div>

                <Divider layout="vertical" className="hidden md:flex">
                    <b>OR</b>
                </Divider>
                <Divider layout="horizontal" className="flex md:hidden" align="center">
                    <b>OR</b>
                </Divider>

                <div className="flex align-items-center justify-content-center">
                    <Button label="Sign Up" icon="pi pi-user-plus" severity="success" className="w-20rem" />
                </div>
            </div>
        </div>
    );
}
