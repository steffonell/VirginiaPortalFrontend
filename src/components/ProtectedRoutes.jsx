import React from "react";
import { Routes, Route } from "react-router-dom";
import BrandsList from "./BrandsList";
import AddBrand from "./AddBrand";
import Brand from "./Brand";
import ArticlesList from "./ArticlesList";
import AddArticle from "./AddArticle";
import Article from "./Article";
import ClientsList from "./ClientsList";
import AddClient from "./AddClient";
import EditClient from "./EditClient";
import IndentsList from "./IndentsList";
import AddIndent from "./AddIndent";
import Indent from "./Indent";
import AddIndentEntry from "./AddIndentEntry";
import IndentEntries from "./IndentEntries";
import DiscountList from "./DiscountList";
import AddCustomerDiscount from "./AddCustomerDiscount";
import Basket from "./Basket";
import AddDeliveryAddress from "./AddDeliveryAddress";
import NavbarComponent from "./NavbarComponent";
import DeliveryAddressesList from "./DeliveryAddressList";
import EditDeliveryAddress from "./EditDeliveryAddress";
import ClientDiscounts from "./ClientDiscounts";
import ClientDeliveryAddresses from "./ClientDeliveryAddresses";
import ShopComponent from "./ShopComponent";
import Forbidden from "./Forbidden";
import ChangePasswordForm from "./ChangePasswordForm";
import AddClientDeliveryAddress from "./AddClientDeliveryAddress";
import EditArticle from "./EditArticle";
import UserInfo from "./UserInfo";
import StatisticsComponent from "./StatisticsComponent";
import HomeComponent from "./HomeComponent";

const ProtectedRoutes = ({ userRole, ProtectedComponent }) => {
    return (
        <>
            <NavbarComponent />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={ProtectedComponent(HomeComponent, userRole, ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_FAKTURISTA', 'ROLE_MAGACIONER'])} />
                    <Route path="/shop" element={ProtectedComponent(ShopComponent, userRole, ['ROLE_USER', 'ROLE_ADMIN'])} />
                    <Route path="/articles" element={ProtectedComponent(ArticlesList, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/articles/add" element={ProtectedComponent(AddArticle, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/articles/:id" element={ProtectedComponent(Article, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/articles/edit/:id" element={ProtectedComponent(EditArticle, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/brands" element={ProtectedComponent(BrandsList, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/brands/add" element={ProtectedComponent(AddBrand, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/brands/:id" element={ProtectedComponent(Brand, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/clients" element={ProtectedComponent(ClientsList, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/clients/edit/:id" element={ProtectedComponent(EditClient, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/address" element={ProtectedComponent(DeliveryAddressesList, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/addressesOfClient" element={ProtectedComponent(ClientDeliveryAddresses, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/address/add" element={ProtectedComponent(AddDeliveryAddress, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/address/edit/:id" element={ProtectedComponent(EditDeliveryAddress, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/address/:id" element={ProtectedComponent(ClientDeliveryAddresses, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/clients/add" element={ProtectedComponent(AddClient, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/editAddressOfSpecifiedClient" element={ProtectedComponent(EditDeliveryAddress, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/addDeliveryAddressToSpecifiedClient" element={ProtectedComponent(AddClientDeliveryAddress, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/indents" element={ProtectedComponent(IndentsList, userRole, ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_FAKTURISTA', 'ROLE_MAGACIONER'])} />
                    <Route path="/change-password" element={ProtectedComponent(ChangePasswordForm, userRole, ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_FAKTURISTA', 'ROLE_MAGACIONER'])} />
                    <Route path="/indents/add" element={ProtectedComponent(AddIndent, userRole, ['ROLE_USER', 'ROLE_ADMIN'])} />
                    <Route path="/indents/:id" element={ProtectedComponent(Indent, userRole, ['ROLE_USER', 'ROLE_ADMIN'])} />
                    <Route path="/indentEntry" element={ProtectedComponent(AddIndentEntry, userRole, ['ROLE_USER', 'ROLE_ADMIN'])} />
                    <Route path="/indents/entries/:code" element={ProtectedComponent(IndentEntries, userRole, ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_FAKTURISTA', 'ROLE_MAGACIONER'])} />
                    <Route path="/discount" element={ProtectedComponent(DiscountList, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/discountsOfClient" element={ProtectedComponent(ClientDiscounts, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/discount/add" element={ProtectedComponent(AddCustomerDiscount, userRole, ['ROLE_ADMIN'])} />
                    <Route path="/basket" element={ProtectedComponent(Basket, userRole, ['ROLE_USER', 'ROLE_ADMIN'])} />
                    <Route path="/userInfo" element={ProtectedComponent(UserInfo, userRole, ['ROLE_USER', 'ROLE_ADMIN'])} />
                    <Route path="/statistics" element={ProtectedComponent(StatisticsComponent, userRole, ['ROLE_USER', 'ROLE_ADMIN'])} />
                    <Route path="/forbidden" element={<Forbidden />} />
                </Routes>
            </div>
        </>
    );
};

export default ProtectedRoutes;
