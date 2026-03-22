import React from 'react';
import SigninForm from '../components/auth/SigninForm';

const Signin = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center pt-[100px] pb-12 px-4 bg-white">
            <SigninForm />
        </div>
    );
};

export default Signin;
