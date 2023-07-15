'use client'
import React, { useEffect } from 'react'
import { Formik, Form } from 'formik';
import LocationDropdown from '../../../../components/statecity/LocationDropdown';
import Checkboxs from '../../../../components/userForm/Checkboxs';
import Inputs from '../../../../components/userForm/Inputs';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { getToken, storeToken } from '../../../redux/services/LocalStorageServices';
import { useRouter } from 'next/navigation';
import { setUserToken } from '../../../redux/features/authSlice';
import { useGetLoggedUserQuery } from '../../../redux/services/userAuthApi';

const Clients = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const token = getToken('token')
    const { isSuccess, isLoading } = useGetLoggedUserQuery(token)
    useEffect(() => {

        if (isSuccess && !isLoading) {
            router.push('auth/verification')
        }
    }, [isSuccess, isLoading])
    const options = {
        interested_in: ['Fractional', 'Property Management', 'Sole selling projects with FIRST/ASSET'],
    }
    const initialValues = {
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        state: null,
        city: null,
        locality: null,
        interested_in: '',
    };
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone: Yup.string().matches(/^\d{10}$/, 'Invalid phone number').required('Phone is required'),
        password: Yup.string().required('Password is required'),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Password confirmation is required'),
        state: Yup.object()
            .shape({
                value: Yup.string().required('City value is required'),
                label: Yup.string().required('City label is required'),
            })
            .required('State in is required'),
        city: Yup.object()
            .shape({
                value: Yup.string().required('State value is required'),
                label: Yup.string().required('State label is required'),
            })
            .required('City is required'),
        locality: Yup.object()
            .shape({
                value: Yup.string().required('Locality value is required'),
                label: Yup.string().required('Locality label is required'),
            })
            .required('Locality in is required'),
        interested_in: Yup.array()
            .of(Yup.string())
            .min(1, 'At least one option must be selected for interest')
            .required('Interested in is required'),
    });

    const handleSubmit = (values) => {

        const data = {
            name: values.name,
            email: values.email,
            phone_no: `+91${values.phone}`,
            password: values.password,
            password_confirmation: values.password_confirmation,
            state: values.state.value,
            city: values.city.value,
            is_mobile_verified:1,
            locality: values.locality.value,
            interested_in: values.interested_in,
        }


        axios.post('https://www.skilliza.com/wscubetech/public/api/user/clientuser-register', data)
            .then(response => {
                // Handle success
                console.log(response);
                if (response.data.status === 'failed') {
                    toast.error(response.data.message)
                }
                if (response.data.status === 'success') {
                    toast.success(response.data.message)
                    dispatch(setUserToken({ token: response.data.token }))
                    storeToken(response.data.token, 'token')
                    router.push('auth/verification')
                }

            })
            .catch(error => {
                if (error.response && error.response.status === 422) {
                    // Validation errors
                    console.log('Validation errors:', error.response.data.errors);
                    const errors = error.response.data.errors;
                    Object.values(errors).map(errorMessages => {
                        errorMessages.map(errorMessage => {
                            toast.error(errorMessage);
                        });
                    });
                } else {
                    // Other errors
                    console.error('Error storing data:', error);
                }
            });
    };

    return (
        <>
            {!isLoading && !isSuccess &&
                <section className='w-full flex justify-center py-10'>
                    <div className='lg:shadow-2xl lg:p-20 lg:rounded-xl p-10'>
                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                            <Form>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <Inputs name='name' label='Name/Organization Name:' />
                                    <Inputs name='email' label='Email' />
                                    <Inputs name='phone' label='Phone No. (Email and Phone No. verification with OTP):' />
                                    <Inputs name='password' label='Password' />
                                    <Inputs name='password_confirmation' label='Confirm Password:' />
                                </div>
                                <div className='border-b-2 border-gray-700 my-10' />
                                <div className="my-3">
                                    <LocationDropdown />
                                </div>
                                <div className='border-b-2 border-gray-700 my-10' />
                                <div className='mt-2'>
                                    <Checkboxs options={options.interested_in} name='interested_in' label='Interested in' />
                                </div>

                                <div className="mt-14 text-center">
                                    <button type="submit" className='bg-teal-500 p-3 px-14 text-white font-semibold rounded-full'>Submit</button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </section>
            }
        </>

    )
}

export default Clients