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
import Numbers from '../../../../components/userForm/Numbers';
import Selects from '../../../../components/userForm/Selects';

const Addclients = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const token = getToken('token')
    const { data, isSuccess, isLoading } = useGetLoggedUserQuery(token)
    const initialValues = {
        name: '',
        email: '',
        phone: '',
        lakhAmount:'',
        croreAmount:'',
    };
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone: Yup.string().matches(/^\d{10}$/, 'Invalid phone number').required('Phone is required'),
        lakhAmount: Yup.number()
    .min(50, 'Minimum value should be 50 lacs')
    .required('This field is required'),
    });
    const options = {
        client_int_property_m_service: [
            {
                value: true, label: 'Yes'
            },
            {
                value: false, label: 'No'
            },
        ],
    }
    
    const handleSubmit = (values) => { 
        console.log(data)
        const datas = {
            name: values.name,
            email: values.email,
            phone_no: `+91${values.phone}`,
            lakhAmount:values.lakhAmount,
            croreAmount:values.croreAmount,
            client_int_soil_s_mandated_project:false,
            client_int_property_m_service:values.client_int_property_m_service,
            id_broker_or_financial:data.user_data.id,
            is_mobile_verified:1,
            brokers_type:data?.user_type === 'Broker' ? 'broker_id' : 'broker_financial_id'
            
        }
        axios.post(`https://www.skilliza.com/wscubetech/public/api/user/broker_add_client`, datas)
            .then(response => {
                // Handle success
                console.log(response);
                if (response.data.status === 'failed') {
                    toast.error(response.data.message)
                }
                if (response.data.status === 'success') {
                    toast.success(response.data.message)
                    // dispatch(setUserToken({ token: response.data.token }))
                    storeToken(response.data.token, 'client_token')
                    router.push('auth/register/add_clients/verification')
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
                <section className='w-full flex justify-center py-10'>
                    <div className='lg:shadow-2xl lg:p-20 lg:rounded-xl p-10'>
                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                            <Form>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <Inputs name='name' label='Name/Organization Name:' />
                                    <Inputs name='email' label='Email' />
                                    <Inputs name='phone' label='Phone No. (Email and Phone No. verification with OTP):' />
                                </div>
                                <div className='border-b-2 border-gray-700 my-10' />
                                <h3 className='block py-2 text-lg font-medium text-gray-900'>Investment Amount</h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <Numbers name='croreAmount' label='Amount in Crore' />
                                    <Numbers name='lakhAmount' label='Amount in lakh' />
                                </div>
                                <div className='mt-3'>
                                <Selects options={options.client_int_property_m_service} name='client_int_property_m_service' label='Is the client also interested in Property Management Services' />
                                </div>
                                <div className="mt-14 text-center">
                                    <button type="submit" className='bg-teal-500 p-3 px-14 text-white font-semibold rounded-full'>Submit</button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </section>
        </>

    )
}

export default Addclients