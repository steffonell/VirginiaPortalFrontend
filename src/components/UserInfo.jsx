import React, { useContext } from "react";
import { ApplicationContext } from "./ApplicationContext";

const UserInfo = () => {
  const { loggedInClient } = useContext(ApplicationContext);

  if (!loggedInClient || Object.keys(loggedInClient).length === 0) {
    return <div className="text-center text-lg font-bold">Nema dostupnih podataka o korisniku</div>;
  }

  const {
    nameOfTheLegalEntity,
    city,
    address,
    pib,
    identificationNumber,
    contactPerson,
    contactNumber,
    email,
    paymentCurrency,
    customerCode,
    isActive,
    comment,
    deliveryAddressList,
    discounts,
  } = loggedInClient;

  return (
    <div className="userInfo p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Informacije o korisniku</h2>
      <p className="mb-2"><span className="font-bold">Naziv pravnog subjekta:</span> {nameOfTheLegalEntity}</p>
      <p className="mb-2"><span className="font-bold">Grad:</span> {city}</p>
      <p className="mb-2"><span className="font-bold">Adresa:</span> {address}</p>
      <p className="mb-2"><span className="font-bold">PIB:</span> {pib}</p>
      <p className="mb-2"><span className="font-bold">Identifikacioni broj:</span> {identificationNumber}</p>
      <p className="mb-2"><span className="font-bold">Kontaktna osoba:</span> {contactPerson}</p>
      <p className="mb-2"><span className="font-bold">Kontakt telefon:</span> {contactNumber}</p>
      <p className="mb-2"><span className="font-bold">Email:</span> {email}</p>
      <p className="mb-2"><span className="font-bold">Valuta plaćanja:</span> {paymentCurrency}</p>
      <p className="mb-2"><span className="font-bold">Kod kupca:</span> {customerCode}</p>
      <p className="mb-2"><span className="font-bold">Aktivan:</span> {isActive ? 'Da' : 'Ne'}</p>
      <p className="mb-2"><span className="font-bold">Komentar:</span> {comment}</p>
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Adrese za isporuku</h3>
        <ul className="list-disc list-inside">
          {deliveryAddressList && deliveryAddressList.map((address, index) => (
            <li key={index} className="mb-1">{address.city}, {address.address}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Popusti</h3>
        <ul className="list-disc list-inside">
          {discounts && discounts.map((discount, index) => (
            <li key={index} className="mb-1">{discount.brand.brandName}: {discount.discount}%</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserInfo;
