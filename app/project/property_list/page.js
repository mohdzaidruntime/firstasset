"use client"
import React, { useEffect, useState } from 'react'
import PropertTable from '../../../components/table/PropertTable'
import { useGetUserPropertyQuery } from '../../redux/services/userAuthApi';
import { getToken } from '../../redux/services/LocalStorageServices';
import { useMemo } from 'react';
import { commercialRents, commercialSales, residetialRents } from '../../../constants/property';

const Property_list = () => {
  const CommercialRentscolumns = useMemo(
    () => commercialRents,
    [],
  );
  const CommercialSalescolumns = useMemo(
    () => commercialSales,
    [],
  )
  const ResidentialRentscolumns = useMemo(
    () => residetialRents,
    [],
  )
  const token = getToken('token')
  const [CommercialRentsData, setCommercialRentsData] = useState([])
  const [CommercialSalesData, setCommercialSalesData] = useState([])
  const [ResidentialRentsData, setResidentialRentsData] = useState([])
  const [ResidentialSalesData, setResidentialSalesData] = useState([])
  const {
    data: userProperty,
    isLoading,
    isSuccess,
    isError,
  } = useGetUserPropertyQuery(token);

  useEffect(() => {
    if (isSuccess) {
      // Merge all arrays into a single array of objects
      const commercial_rents = [
        ...userProperty.commercial_rents,
        // ...userProperty.residential_rents,
        // ...userProperty.residential_sales,
      ];
      const commercial_sales = [
        ...userProperty.commercial_sales,
      ];
      const residential_rents = [
        ...userProperty.residential_rents,
      ]
      const residential_sales = [
        ...userProperty.residential_sales,
      ]
      setCommercialSalesData(commercial_sales)
      setCommercialRentsData(commercial_rents)
      setResidentialRentsData(residential_rents)
      setResidentialSalesData(residential_sales)
    }
  }, [isSuccess, userProperty]);

  return (
    <div>{isSuccess && !isLoading &&
      <>
        <PropertTable columns={CommercialRentscolumns} type='c_rents' heading='COMMERCIAL RENTS PROPERTY' link="/project/commercial_rent" data={CommercialRentsData} />
        <PropertTable columns={CommercialSalescolumns} type='c_sales' heading='COMMERCIAL Sales PROPERTY' link="/project/commercial_sale" data={CommercialSalesData} />
        <PropertTable columns={ResidentialRentscolumns} type='r_rents' heading='Residential RENTS PROPERTY' link="/project/residential_rent" data={ResidentialRentsData} />
        <PropertTable columns={CommercialSalescolumns} type='r_sales' heading='Residential Sales PROPERTY' link="/project/residential_sale" data={ResidentialSalesData} />
      </>
    }</div>
  )
}

export default Property_list